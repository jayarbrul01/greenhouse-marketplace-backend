import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/errors.js";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal Server Error" });
}
