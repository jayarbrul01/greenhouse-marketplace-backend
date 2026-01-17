import { verifyAccessToken } from "../config/jwt.js";
import { HttpError } from "../utils/errors.js";
export function requireAuth(req, _res, next) {
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
    }
    catch (error) {
        console.error("Token verification failed:", error.message);
        throw error;
    }
}
//# sourceMappingURL=auth.middleware.js.map