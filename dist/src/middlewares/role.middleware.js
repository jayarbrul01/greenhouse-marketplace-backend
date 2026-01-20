import { HttpError } from "../utils/errors.js";
export function requireRole(anyOf) {
    return (req, _res, next) => {
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
//# sourceMappingURL=role.middleware.js.map