import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { HttpError } from "../../utils/errors.js";
import { env } from "../../config/env.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Base upload directory (relative to backend root)
const UPLOAD_BASE_DIR = path.join(__dirname, "../../../uploads");
const IMAGES_DIR = path.join(UPLOAD_BASE_DIR, "images");
const VIDEOS_DIR = path.join(UPLOAD_BASE_DIR, "videos");
// Ensure upload directories exist
async function ensureDirectoriesExist() {
    try {
        await fs.mkdir(IMAGES_DIR, { recursive: true });
        await fs.mkdir(VIDEOS_DIR, { recursive: true });
    }
    catch (error) {
        console.error("Failed to create upload directories:", error);
        throw new HttpError(500, "Failed to initialize upload directories");
    }
}
// Initialize directories on module load
ensureDirectoriesExist().catch(console.error);
// Get public URL for uploaded file
function getPublicUrl(filePath, type) {
    // Get the API base URL (backend URL)
    const apiBaseUrl = env.API_BASE_URL.replace(/\/$/, ""); // Remove trailing slash
    // Get relative path from UPLOAD_BASE_DIR
    const relativePath = path.relative(UPLOAD_BASE_DIR, filePath).replace(/\\/g, "/");
    return `${apiBaseUrl}/uploads/${relativePath}`;
}
export const uploadService = {
    async uploadImage(file, fileName, userId) {
        console.log("=== uploadService.uploadImage ===");
        console.log("File name:", fileName);
        console.log("User ID:", userId);
        console.log("File buffer size:", file.length, "bytes");
        const fileExt = fileName.split(".").pop()?.toLowerCase() || "jpg";
        const timestamp = Date.now();
        const sanitizedFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const userDir = path.join(IMAGES_DIR, userId);
        const filePath = path.join(userDir, sanitizedFileName);
        console.log("Target file path:", filePath);
        console.log("Content type:", `image/${fileExt}`);
        try {
            // Ensure user directory exists
            await fs.mkdir(userDir, { recursive: true });
            // Write file to disk
            await fs.writeFile(filePath, file);
            console.log("File uploaded successfully to:", filePath);
            // Generate public URL
            const publicUrl = getPublicUrl(filePath, "image");
            const relativePath = path.relative(UPLOAD_BASE_DIR, filePath).replace(/\\/g, "/");
            console.log("Public URL:", publicUrl);
            console.log("Returning:", { url: publicUrl, path: relativePath });
            return { url: publicUrl, path: relativePath };
        }
        catch (error) {
            console.error("File upload error:", error);
            throw new HttpError(500, `Failed to upload image: ${error.message}`);
        }
    },
    async uploadVideo(file, fileName, userId) {
        console.log("=== uploadService.uploadVideo ===");
        console.log("File name:", fileName);
        console.log("User ID:", userId);
        console.log("File buffer size:", file.length, "bytes");
        const fileExt = fileName.split(".").pop()?.toLowerCase() || "mp4";
        const timestamp = Date.now();
        const sanitizedFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const userDir = path.join(VIDEOS_DIR, userId);
        const filePath = path.join(userDir, sanitizedFileName);
        try {
            // Ensure user directory exists
            await fs.mkdir(userDir, { recursive: true });
            // Write file to disk
            await fs.writeFile(filePath, file);
            console.log("File uploaded successfully to:", filePath);
            // Generate public URL
            const publicUrl = getPublicUrl(filePath, "video");
            const relativePath = path.relative(UPLOAD_BASE_DIR, filePath).replace(/\\/g, "/");
            return { url: publicUrl, path: relativePath };
        }
        catch (error) {
            console.error("File upload error:", error);
            throw new HttpError(500, `Failed to upload video: ${error.message}`);
        }
    },
    async deleteFile(filePath) {
        try {
            // filePath should be relative to UPLOAD_BASE_DIR
            const fullPath = path.join(UPLOAD_BASE_DIR, filePath);
            // Check if file exists
            await fs.access(fullPath);
            // Delete file
            await fs.unlink(fullPath);
            return { success: true };
        }
        catch (error) {
            if (error.code === "ENOENT") {
                // File doesn't exist, consider it already deleted
                return { success: true };
            }
            throw new HttpError(500, `Failed to delete file: ${error.message}`);
        }
    },
};
//# sourceMappingURL=upload.service.js.map