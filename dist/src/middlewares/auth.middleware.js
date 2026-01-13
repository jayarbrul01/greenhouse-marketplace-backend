import { verifyAccessToken } from "../config/jwt.js";
import { HttpError } from "../utils/errors.js";
export function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
        throw new HttpError(401, "Missing token");
    const token = header.substring("Bearer ".length);
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, roles: payload.roles };
    next();
}
//# sourceMappingURL=auth.middleware.js.map