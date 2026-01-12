import type { Response } from "express";
import { prisma } from "../../config/prisma.js";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
import { HttpError } from "../../utils/errors.js";

export const usersController = {
  me: async (req: AuthedRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, phone: true,
        fullName: true, region: true, preferredLanguage: true,
        emailVerified: true, phoneVerified: true,
        notifyEmail: true, notifySms: true, notifyInApp: true,
        createdAt: true
      }
    });
    if (!user) throw new HttpError(404, "User not found");
    res.json(user);
  },

  updateMe: async (req: AuthedRequest, res: Response) => {
    const { body } = (req as any).validated;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: body,
      select: {
        id: true, email: true, phone: true,
        fullName: true, region: true, preferredLanguage: true
      }
    });
    res.json(user);
  },

  updatePrefs: async (req: AuthedRequest, res: Response) => {
    const { body } = (req as any).validated;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: body,
      select: { notifyEmail: true, notifySms: true, notifyInApp: true }
    });
    res.json(user);
  }
};
