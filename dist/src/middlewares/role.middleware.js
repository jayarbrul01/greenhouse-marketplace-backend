import { HttpError } from "../utils/errors.js";
export function requireRole(anyOf) {
    return (req, _res, next) => {
        console.log("=== requireRole middleware ===");
        console.log("Required roles:", anyOf);
        console.log("User:", req.user);
        console.log("User roles from token:", req.user?.roles || []);
        const roles = req.user?.roles || [];
        const hasRequiredRole = anyOf.some(r => roles.includes(r));
        console.log("Has required role:", hasRequiredRole);
        if (!hasRequiredRole) {
            console.log("ERROR: User does not have required role. Required:", anyOf, "User has:", roles);
            throw new HttpError(403, "Forbidden");
        }
        console.log("Role check passed, proceeding to next middleware");
        next();
    };
}
//# sourceMappingURL=role.middleware.js.map