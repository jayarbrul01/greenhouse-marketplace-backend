import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";

export const authController = {
  register: async (req: Request, res: Response) => {
    console.log("register: ", req.body);
    const { body } = (req as any).validated;
    const out = await authService.register(body);
    res.json(out);
  },

  login: async (req: Request, res: Response) => {
    const { body } = (req as any).validated;
    const out = await authService.login(body);
    res.json(out);
  },

  refresh: async (req: Request, res: Response) => {
    const { body } = (req as any).validated;
    const out = await authService.refresh(body);
    res.json(out);
  },

  verifyEmail: async (req: AuthedRequest, res: Response) => {
    const { body } = (req as any).validated;
    const out = await authService.verifyEmail(req.user!.id, body.code);
    res.json(out);
  },

  verifyPhone: async (req: AuthedRequest, res: Response) => {
    const { body } = (req as any).validated;
    const out = await authService.verifyPhone(req.user!.id, body.code);
    res.json(out);
  },

  checkFirebaseEmailVerification: async (req: Request, res: Response) => {
    const { body } = (req as any).validated;
    const out = await authService.checkFirebaseEmailVerification(body);
    res.json(out);
  },

  googleAuth: async (req: Request, res: Response) => {
    const { body } = (req as any).validated;
    const out = await authService.googleAuth(body);
    res.json(out);
  },

  firebaseAuth: async (req: Request, res: Response) => {
    const { body } = (req as any).validated;
    const out = await authService.firebaseAuth(body);
    res.json(out);
  }
};
