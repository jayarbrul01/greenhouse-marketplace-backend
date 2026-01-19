import type { Response, NextFunction } from "express";
import type { AuthedRequest } from "./auth.middleware.js";
import { HttpError } from "../utils/errors.js";

export function requireRole(anyOf: string[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {

    
    const roles = req.user?.roles || [];
    const hasRequiredRole = anyOf.some(r => roles.includes(r));
    
    if (!hasRequiredRole) {
      console.log("ERROR: User does not have required role. Required:", anyOf, "User has:", roles);
      throw new HttpError(403, "Forbidden");
    }
    
    console.log("Role check passed, proceeding to next middleware");
    next();
  };
}
