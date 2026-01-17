import { HttpError } from "../utils/errors.js";
export function errorMiddleware(err, _req, res, _next) {
    if (err instanceof HttpError) {
        return res.status(err.status).json({ error: err.message, details: err.details });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
}
//# sourceMappingURL=error.middleware.js.map