import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { uploadController, upload } from "./upload.controller.js";
const r = Router();
// All routes require authentication and SELLER role
r.use(requireAuth);
r.use(requireRole(["SELLER"]));
// Upload image
r.post("/image", upload.single("file"), uploadController.uploadImage);
// Upload video
r.post("/video", upload.single("file"), uploadController.uploadVideo);
export default r;
//# sourceMappingURL=upload.routes.js.map