import { HttpError } from "../utils/errors.js";
export function requireRole(anyOf) {
    return (req, _res, next) => {
        const roles = req.user?.roles || [];
        if (!anyOf.some(r => roles.includes(r)))
            throw new HttpError(403, "Forbidden");
        next();
    };
}
//# sourceMappingURL=role.middleware.js.map