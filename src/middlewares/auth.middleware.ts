import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt.js";
import { HttpError } from "../utils/errors.js";

export type AuthedRequest = Request & { user?: { id: string; roles: string[] } };

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  console.log("=== requireAuth middleware ===");
  console.log("Request path:", req.path);
  console.log("Request method:", req.method);
  
  const header = req.headers.authorization;
  console.log("Authorization header present:", !!header);
  
  if (!header?.startsWith("Bearer ")) {
    console.log("ERROR: Missing or invalid authorization header");
    throw new HttpError(401, "Missing token");
  }
  
  const token = header.substring("Bearer ".length);
  console.log("Token length:", token.length);
  
  try {
    const payload = verifyAccessToken(token);
    console.log("Token verified successfully");
    console.log("User ID from token:", payload.sub);
    console.log("Roles from token:", payload.roles);
    
    req.user = { id: payload.sub, roles: payload.roles };
    console.log("User set on request object");
    next();
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    throw error;
  }
}
