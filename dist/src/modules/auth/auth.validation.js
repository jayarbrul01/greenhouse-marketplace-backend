import { z } from "zod";
export const RegisterSchema = z.object({
    body: z.object({
        email: z.string().email(),
        phone: z.string().min(7),
        password: z.string().min(8),
        roles: z.array(z.enum(["BUYER", "SELLER", "WISHLIST"])).min(1)
    })
});
export const LoginSchema = z.object({
    body: z.object({
        emailOrPhone: z.string().min(3),
        password: z.string().min(8)
    })
});
export const VerifyEmailSchema = z.object({
    body: z.object({
        code: z.string().min(4).max(10)
    })
});
export const VerifyPhoneSchema = z.object({
    body: z.object({
        code: z.string().min(4).max(10)
    })
});
export const RefreshSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(10)
    })
});
export const GoogleAuthSchema = z.object({
    body: z.object({
        idToken: z.string().min(10)
    })
});
export const FirebaseAuthSchema = z.object({
    body: z.object({
        idToken: z.string().min(10),
        phone: z.string().min(7).optional(),
        password: z.string().min(8).optional(),
        roles: z.array(z.enum(["BUYER", "SELLER", "WISHLIST"])).min(1).optional()
    })
});
export const CheckFirebaseVerificationSchema = z.object({
    body: z.object({
        idToken: z.string().min(10)
    })
});
//# sourceMappingURL=auth.validation.js.map