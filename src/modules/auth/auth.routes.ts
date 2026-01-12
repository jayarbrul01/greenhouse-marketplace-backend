import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { authController } from "./auth.controller.js";
import { RegisterSchema, LoginSchema, RefreshSchema, VerifyEmailSchema, VerifyPhoneSchema, GoogleAuthSchema } from "./auth.validation.js";

const r = Router();

r.post("/register", validate(RegisterSchema), authController.register);
r.post("/login", validate(LoginSchema), authController.login);
r.post("/refresh", validate(RefreshSchema), authController.refresh);

r.post("/verify-email", requireAuth, validate(VerifyEmailSchema), authController.verifyEmail);
r.post("/verify-phone", requireAuth, validate(VerifyPhoneSchema), authController.verifyPhone);
r.post("/google", validate(GoogleAuthSchema), authController.googleAuth);

export default r;
