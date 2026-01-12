import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt.js";
import { HttpError } from "../utils/errors.js";

export type AuthedRequest = Request & { user?: { id: string; roles: string[] } };

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new HttpError(401, "Missing token");
  const token = header.substring("Bearer ".length);
  const payload = verifyAccessToken(token);
  req.user = { id: payload.sub, roles: payload.roles };
  next();
}
