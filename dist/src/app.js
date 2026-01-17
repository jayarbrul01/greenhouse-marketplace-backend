import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import listingsRoutes from "./modules/listings/listings.routes.js";
import postsRoutes from "./modules/posts/posts.routes.js";
import uploadRoutes from "./modules/posts/upload.routes.js";
// import categoriesRoutes from "./modules/categories/categories.routes.js";
// import mediaRoutes from "./modules/media/media.routes.js";
// import wishlistRoutes from "./modules/wishlist/wishlist.routes.js";
// import notificationsRoutes from "./modules/notifications/notifications.routes.js";
// import searchRoutes from "./modules/search/search.routes.js";
export const app = express();
// Configure Helmet with crossOrigin settings for images/videos
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
}));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(morgan("dev"));
// Serve static files from uploads directory with CORS headers
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Custom middleware for static files with CORS
app.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", env.CORS_ORIGIN);
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
}, express.static(path.join(__dirname, "../uploads")));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/listings", listingsRoutes);
app.use("/api/v1/posts", postsRoutes);
app.use("/api/v1/upload", uploadRoutes);
// app.use("/api/v1/categories", categoriesRoutes);
// app.use("/api/v1/media", mediaRoutes);
// app.use("/api/v1/wishlist", wishlistRoutes);
// app.use("/api/v1/notifications", notificationsRoutes);
// app.use("/api/v1/search", searchRoutes);
app.use(errorMiddleware);
//# sourceMappingURL=app.js.map