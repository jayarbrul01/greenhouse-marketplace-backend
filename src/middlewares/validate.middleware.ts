import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { HttpError } from "../utils/errors.js";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Debug logging
    console.log("Content-Type:", req.get("Content-Type"));
    console.log("Request body:", req.body);
    console.log("Request method:", req.method);
    
    // Ensure body exists for POST/PUT/PATCH requests
    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body === undefined) {
      throw new HttpError(400, "Request body is missing. Ensure Content-Type is 'application/json'", {
        formErrors: [],
        fieldErrors: { body: ["Request body is undefined. Make sure to send JSON with Content-Type: application/json"] }
      });
    }
    
    const result = schema.safeParse({ 
      body: req.body ?? {}, 
      query: req.query ?? {}, 
      params: req.params ?? {} 
    });
    
    if (!result.success) {
      throw new HttpError(400, "Validation error", result.error.flatten());
    }
    
    (req as any).validated = result.data;
    next();
  };
}
