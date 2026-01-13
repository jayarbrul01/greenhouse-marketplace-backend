import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../utils/errors.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { randomCode } from "../../utils/random.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../config/jwt.js";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import { env } from "../../config/env.js";
import { firebaseAdmin } from "../../config/firebase.js";

function addMinutes(date: Date, mins: number) {
  return new Date(date.getTime() + mins * 60000);
}

async function getUserRoles(userId: string) {
  const roles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true }
  });
  return roles.map((r: { role: { name: string } }) => r.role.name);
}

export const authService = {
  async register(input: { email: string; phone: string; password: string; roles: string[] }) {
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { phone: input.phone }] }
    });
    if (exists) throw new HttpError(409, "Email or phone already in use");

    const passwordHash = await hashPassword(input.password);

    const emailCode = randomCode(6);
    const phoneCode = randomCode(6);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        passwordHash,
        emailCode,
        phoneCode,
        emailCodeExpiresAt: addMinutes(new Date(), 30),
        phoneCodeExpiresAt: addMinutes(new Date(), 30),
        roles: {
          create: await Promise.all(
            input.roles.map(async (r) => {
              const role = await prisma.role.findUnique({ where: { name: r as any } });
              if (!role) throw new HttpError(400, `Invalid role: ${r}`);
              return { roleId: role.id };
            })
          )
        }
      }
    });

    const roles = await getUserRoles(user.id);
    const accessToken = signAccessToken({ sub: user.id, roles });
    const refreshToken = signRefreshToken({ sub: user.id, roles });

    // Store refresh token hash
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: addMinutes(new Date(), 60 * 24 * 30) // ~30 days
      }
    });

    return {
      user: { id: user.id, email: user.email, phone: user.phone, roles },
      accessToken,
      refreshToken,
      // DEV helper (remove in production):
      devVerification: { emailCode, phoneCode }
    };
  },

  async login(input: { emailOrPhone: string; password: string }) {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: input.emailOrPhone }, { phone: input.emailOrPhone }] }
    });
    if (!user) throw new HttpError(401, "Invalid credentials");

    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid credentials");

    const roles = await getUserRoles(user.id);
    const accessToken = signAccessToken({ sub: user.id, roles });
    const refreshToken = signRefreshToken({ sub: user.id, roles });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: addMinutes(new Date(), 60 * 24 * 30)
      }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        roles
      },
      accessToken,
      refreshToken
    };
  },

  async refresh(input: { refreshToken: string }) {
    const payload = verifyRefreshToken(input.refreshToken);
    const userId = payload.sub;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(401, "Invalid refresh token");

    // Verify refresh token exists (by hash match)
    const tokens = await prisma.refreshToken.findMany({ where: { userId } });
    const match = await Promise.all(
      tokens.map((token: { tokenHash: string }) => bcrypt.compare(input.refreshToken, token.tokenHash))
    );
    if (!match.some(Boolean)) throw new HttpError(401, "Invalid refresh token");

    const roles = await getUserRoles(userId);
    const accessToken = signAccessToken({ sub: userId, roles });
    return { accessToken };
  },

  async verifyEmail(userId: string, code: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(404, "User not found");
    if (!user.emailCode || !user.emailCodeExpiresAt) throw new HttpError(400, "No email code requested");
    if (user.emailCodeExpiresAt < new Date()) throw new HttpError(400, "Email code expired");
    if (user.emailCode !== code) throw new HttpError(400, "Invalid email code");

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true, emailCode: null, emailCodeExpiresAt: null }
    });

    return { ok: true };
  },

  async verifyPhone(userId: string, code: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(404, "User not found");
    if (!user.phoneCode || !user.phoneCodeExpiresAt) throw new HttpError(400, "No phone code requested");
    if (user.phoneCodeExpiresAt < new Date()) throw new HttpError(400, "Phone code expired");
    if (user.phoneCode !== code) throw new HttpError(400, "Invalid phone code");

    await prisma.user.update({
      where: { id: userId },
      data: { phoneVerified: true, phoneCode: null, phoneCodeExpiresAt: null }
    });

    return { ok: true };
  },

  async checkFirebaseEmailVerification(input: { idToken: string }) {
    try {
      // Verify the Firebase ID token
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(input.idToken);
      
      if (!decodedToken.email) {
        throw new HttpError(400, "Firebase token missing email");
      }

      const firebaseEmail = decodedToken.email;
      const emailVerified = decodedToken.email_verified || false;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: firebaseEmail }
      });

      if (!user) {
        throw new HttpError(404, "User not found");
      }

      // Update email verification status if it changed
      if (user.emailVerified !== emailVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: emailVerified }
        });
      }

      return {
        emailVerified: emailVerified,
        message: emailVerified 
          ? "Email verified successfully!" 
          : "Email not yet verified. Please check your email and click the verification link."
      };
    } catch (error: any) {
      if (error instanceof HttpError) throw error;
      // Handle Firebase-specific errors
      if (error.code === "auth/id-token-expired" || error.code === "auth/id-token-revoked") {
        throw new HttpError(401, "Firebase token expired or revoked");
      }
      if (error.code === "auth/argument-error") {
        throw new HttpError(400, "Invalid Firebase token");
      }
      throw new HttpError(401, "Invalid Firebase token");
    }
  },

  async googleAuth(input: { idToken: string }) {
    const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    
    try {
      const ticket = await client.verifyIdToken({
        idToken: input.idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new HttpError(400, "Invalid Google token");
      }

      const googleEmail = payload.email;
      const googleName = payload.name || "";
      const googlePicture = payload.picture || "";

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email: googleEmail }
      });

      let isNewUser = false;

      if (!user) {
        // Create new user with Google auth
        // Generate a random phone number placeholder (user can update later)
        const randomPhone = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        
        // Assign default role (BUYER) for Google signups
        const buyerRole = await prisma.role.findUnique({ where: { name: "BUYER" } });
        if (!buyerRole) throw new HttpError(500, "Default role not found");

        user = await prisma.user.create({
          data: {
            email: googleEmail,
            phone: randomPhone,
            passwordHash: "", // No password for Google auth
            fullName: googleName,
            emailVerified: true, // Google emails are pre-verified
            phoneVerified: false,
            roles: {
              create: [{ roleId: buyerRole.id }]
            }
          }
        });
        isNewUser = true;
      } else {
        // Existing user - mark email as verified if not already
        if (!user.emailVerified) {
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: true }
          });
        }
      }

      const roles = await getUserRoles(user.id);
      const accessToken = signAccessToken({ sub: user.id, roles });
      const refreshToken = signRefreshToken({ sub: user.id, roles });

      // Store refresh token hash
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: await bcrypt.hash(refreshToken, 10),
          expiresAt: addMinutes(new Date(), 60 * 24 * 30) // ~30 days
        }
      });

      return {
        user: { id: user.id, email: user.email, phone: user.phone, roles },
        accessToken,
        refreshToken,
        isNewUser
      };
    } catch (error: any) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(401, "Invalid Google token");
    }
  },

  async firebaseAuth(input: { idToken: string; phone?: string; roles?: string[] }) {
    try {
      // Verify the Firebase ID token
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(input.idToken);
      
      if (!decodedToken.email) {
        throw new HttpError(400, "Firebase token missing email");
      }

      const firebaseEmail = decodedToken.email;
      const firebaseName = decodedToken.name || "";
      const firebaseUid = decodedToken.uid;
      const emailVerified = decodedToken.email_verified || false;
      const phoneNumber = input.phone;

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email: firebaseEmail }
      });

      let isNewUser = false;

      if (!user) {
        // Create new user with Firebase auth
        // If phone is not provided, generate a placeholder (user can update later)
        const userPhone = phoneNumber;
        
        // Use provided roles or default to BUYER
        const rolesToAssign = input.roles && input.roles.length > 0 
          ? input.roles 
          : ["BUYER"];

        // Get or create roles
        const rolePromises = rolesToAssign.map(async (roleName) => {
          let role = await prisma.role.findUnique({ where: { name: roleName as any } });
          if (!role) {
            throw new HttpError(400, `Invalid role: ${roleName}`);
          }
          return { roleId: role.id };
        });

        user = await prisma.user.create({
          data: {
            email: firebaseEmail,
            phone: userPhone,
            passwordHash: "", // No password for Firebase auth
            fullName: firebaseName,
            emailVerified: emailVerified, // Use Firebase verification status
            phoneVerified: phoneNumber ? true : false, // If phone came from Firebase, it's verified
            roles: {
              create: await Promise.all(rolePromises)
            }
          }
        });
        isNewUser = true;
      } else {
        // Existing user - update email verification status from Firebase
        if (user.emailVerified !== emailVerified) {
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: emailVerified }
          });
        }
        // Update phone if provided and different
        if (phoneNumber && phoneNumber !== user.phone) {
          await prisma.user.update({
            where: { id: user.id },
            data: { phone: phoneNumber, phoneVerified: false }
          });
        }
      }

      const roles = await getUserRoles(user.id);
      const accessToken = signAccessToken({ sub: user.id, roles });
      const refreshToken = signRefreshToken({ sub: user.id, roles });

      // Store refresh token hash
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: await bcrypt.hash(refreshToken, 10),
          expiresAt: addMinutes(new Date(), 60 * 24 * 30) // ~30 days
        }
      });

      return {
        user: { id: user.id, email: user.email, phone: user.phone, roles, emailVerified: user.emailVerified },
        accessToken,
        refreshToken,
        isNewUser
      };
    } catch (error: any) {
      if (error instanceof HttpError) throw error;
      // Handle Firebase-specific errors
      if (error.code === "auth/id-token-expired" || error.code === "auth/id-token-revoked") {
        throw new HttpError(401, "Firebase token expired or revoked");
      }
      if (error.code === "auth/argument-error") {
        throw new HttpError(400, "Invalid Firebase token");
      }
      throw new HttpError(401, "Invalid Firebase token");
    }
  }
};
