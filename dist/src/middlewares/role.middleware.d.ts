import type { Response, NextFunction } from "express";
import type { AuthedRequest } from "./auth.middleware.js";
export declare function requireRole(anyOf: string[]): (req: AuthedRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map