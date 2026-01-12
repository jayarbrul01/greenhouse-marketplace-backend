import type { Response, NextFunction } from "express";
import type { AuthedRequest } from "./auth.middleware.js";
import { HttpError } from "../utils/errors.js";

export function requireRole(anyOf: string[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    const roles = req.user?.roles || [];
    if (!anyOf.some(r => roles.includes(r))) throw new HttpError(403, "Forbidden");
    next();
  };
}
