import type { Request, Response, NextFunction } from "express";
export type AuthedRequest = Request & {
    user?: {
        id: string;
        roles: string[];
    };
};
export declare function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map