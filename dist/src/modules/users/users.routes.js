import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { usersController } from "./users.controller.js";
import { UpdateMeSchema, UpdatePrefsSchema } from "./users.validation.js";
const r = Router();
r.get("/me", requireAuth, usersController.me);
r.put("/me", requireAuth, validate(UpdateMeSchema), usersController.updateMe);
r.put("/preferences", requireAuth, validate(UpdatePrefsSchema), usersController.updatePrefs);
export default r;
//# sourceMappingURL=users.routes.js.map