import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../utils/errors.js";
import { signAccessToken, signRefreshToken } from "../../config/jwt.js";
import bcrypt from "bcrypt";
async function getUserRoles(userId) {
    const roles = await prisma.userRole.findMany({
        where: { userId },
        include: { role: true }
    });
    return roles.map((r) => r.role.name);
}
function addMinutes(date, mins) {
    return new Date(date.getTime() + mins * 60000);
}
export const usersController = {
    me: async (req, res) => {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true, email: true, phone: true,
                fullName: true, region: true, preferredLanguage: true,
                emailVerified: true, phoneVerified: true,
                notifyEmail: true, notifySms: true, notifyInApp: true,
                avatar: true, createdAt: true
            }
        });
        if (!user)
            throw new HttpError(404, "User not found");
        const roles = await getUserRoles(req.user.id);
        res.json({ ...user, roles });
    },
    updateMe: async (req, res) => {
        const { body } = req.validated;
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: body,
            select: {
                id: true, email: true, phone: true,
                fullName: true, region: true, preferredLanguage: true,
                avatar: true
            }
        });
        res.json(user);
    },
    updatePrefs: async (req, res) => {
        const { body } = req.validated;
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: body,
            select: { notifyEmail: true, notifySms: true, notifyInApp: true }
        });
        res.json(user);
    },
    updateRoles: async (req, res) => {
        const { body } = req.validated;
        const userId = req.user.id;
        const { roles: roleNames } = body;
        // Get or create roles
        const rolePromises = roleNames.map(async (roleName) => {
            let role = await prisma.role.findUnique({ where: { name: roleName } });
            if (!role) {
                // Auto-create role if it doesn't exist
                const validRoles = ["BUYER", "SELLER", "WISHLIST"];
                if (!validRoles.includes(roleName)) {
                    throw new HttpError(400, `Invalid role: ${roleName}`);
                }
                role = await prisma.role.create({
                    data: { name: roleName }
                });
            }
            return role.id;
        });
        const roleIds = await Promise.all(rolePromises);
        // Delete all existing user roles
        await prisma.userRole.deleteMany({
            where: { userId }
        });
        // Create new user roles
        await prisma.userRole.createMany({
            data: roleIds.map(roleId => ({
                userId,
                roleId
            }))
        });
        // Get updated roles
        const updatedRoles = await getUserRoles(userId);
        // Generate new tokens with updated roles
        const accessToken = signAccessToken({ sub: userId, roles: updatedRoles });
        const refreshToken = signRefreshToken({ sub: userId, roles: updatedRoles });
        // Store refresh token hash
        await prisma.refreshToken.create({
            data: {
                userId: userId,
                tokenHash: await bcrypt.hash(refreshToken, 10),
                expiresAt: addMinutes(new Date(), 60 * 24 * 30) // ~30 days
            }
        });
        res.json({
            roles: updatedRoles,
            accessToken,
            refreshToken
        });
    },
    getUserById: async (req, res) => {
        const userId = req.params.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true,
                emailVerified: true,
                phoneVerified: true,
                avatar: true,
            }
        });
        if (!user)
            throw new HttpError(404, "User not found");
        res.json({ user });
    }
};
//# sourceMappingURL=users.controller.js.map