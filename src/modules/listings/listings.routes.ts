import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { listingsController } from "./listings.controller.js";
import { GetListingsSchema } from "./listings.validation.js";

const r = Router();

r.get("/", validate(GetListingsSchema), listingsController.getListings);

export default r;
