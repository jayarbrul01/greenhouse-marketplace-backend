import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
// import listingsRoutes from "./modules/listings/listings.routes.js";
// import categoriesRoutes from "./modules/categories/categories.routes.js";
// import mediaRoutes from "./modules/media/media.routes.js";
// import wishlistRoutes from "./modules/wishlist/wishlist.routes.js";
// import notificationsRoutes from "./modules/notifications/notifications.routes.js";
// import searchRoutes from "./modules/search/search.routes.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
// app.use("/api/v1/listings", listingsRoutes);
// app.use("/api/v1/categories", categoriesRoutes);
// app.use("/api/v1/media", mediaRoutes);
// app.use("/api/v1/wishlist", wishlistRoutes);
// app.use("/api/v1/notifications", notificationsRoutes);
// app.use("/api/v1/search", searchRoutes);

app.use(errorMiddleware);
