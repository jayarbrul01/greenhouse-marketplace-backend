import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../utils/errors.js";
export const usersController = {
    me: async (req, res) => {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true, email: true, phone: true,
                fullName: true, region: true, preferredLanguage: true,
                emailVerified: true, phoneVerified: true,
                notifyEmail: true, notifySms: true, notifyInApp: true,
                createdAt: true
            }
        });
        if (!user)
            throw new HttpError(404, "User not found");
        res.json(user);
    },
    updateMe: async (req, res) => {
        const { body } = req.validated;
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: body,
            select: {
                id: true, email: true, phone: true,
                fullName: true, region: true, preferredLanguage: true
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
    }
};
//# sourceMappingURL=users.controller.js.map