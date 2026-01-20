import { verifyAccessToken } from "../config/jwt.js";
import { HttpError } from "../utils/errors.js";
export function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        console.log("ERROR: Missing or invalid authorization header");
        throw new HttpError(401, "Missing token");
    }
    const token = header.substring("Bearer ".length);
    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, roles: payload.roles };
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error.message);
        throw error;
    }
}
//# sourceMappingURL=auth.middleware.js.map