import { HttpError } from "../../utils/errors.js";
import { supabase, STORAGE_BUCKETS } from "../../config/supabase.js";
/**
 * Generate a unique file path for Supabase storage
 */
function generateFilePath(userId, fileName, type) {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${userId}/${timestamp}-${sanitizedFileName}`;
    return filePath;
}
/**
 * Get the content type based on file extension
 */
function getContentType(fileName, type) {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (type === "image") {
        const imageTypes = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            webp: "image/webp",
            svg: "image/svg+xml",
        };
        return imageTypes[ext] || "image/jpeg";
    }
    else {
        const videoTypes = {
            mp4: "video/mp4",
            webm: "video/webm",
            ogg: "video/ogg",
            mov: "video/quicktime",
            avi: "video/x-msvideo",
        };
        return videoTypes[ext] || "video/mp4";
    }
}
export const uploadService = {
    async uploadImage(file, fileName, userId) {
        console.log("=== uploadService.uploadImage (Supabase) ===");
        console.log("File name:", fileName);
        console.log("User ID:", userId);
        console.log("File buffer size:", file.length, "bytes");
        const bucket = STORAGE_BUCKETS.IMAGES;
        const filePath = generateFilePath(userId, fileName, "image");
        const contentType = getContentType(fileName, "image");
        console.log("Uploading to Supabase Storage:");
        console.log("Bucket:", bucket);
        console.log("File path:", filePath);
        console.log("Content type:", contentType);
        try {
            // Upload file to Supabase Storage
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                contentType,
                upsert: false, // Don't overwrite existing files
            });
            if (error) {
                console.error("Supabase upload error:", error);
                throw new HttpError(500, `Failed to upload image to Supabase: ${error.message}`);
            }
            console.log("File uploaded successfully to Supabase:", data.path);
            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);
            const publicUrl = urlData.publicUrl;
            console.log("Public URL:", publicUrl);
            console.log("Returning:", { url: publicUrl, path: filePath });
            return { url: publicUrl, path: filePath };
        }
        catch (error) {
            console.error("File upload error:", error);
            if (error instanceof HttpError) {
                throw error;
            }
            throw new HttpError(500, `Failed to upload image: ${error.message}`);
        }
    },
    async uploadVideo(file, fileName, userId) {
        console.log("=== uploadService.uploadVideo (Supabase) ===");
        console.log("File name:", fileName);
        console.log("User ID:", userId);
        console.log("File buffer size:", file.length, "bytes");
        const bucket = STORAGE_BUCKETS.VIDEOS;
        const filePath = generateFilePath(userId, fileName, "video");
        const contentType = getContentType(fileName, "video");
        console.log("Uploading to Supabase Storage:");
        console.log("Bucket:", bucket);
        console.log("File path:", filePath);
        console.log("Content type:", contentType);
        try {
            // Upload file to Supabase Storage
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                contentType,
                upsert: false, // Don't overwrite existing files
            });
            if (error) {
                console.error("Supabase upload error:", error);
                throw new HttpError(500, `Failed to upload video to Supabase: ${error.message}`);
            }
            console.log("File uploaded successfully to Supabase:", data.path);
            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);
            const publicUrl = urlData.publicUrl;
            console.log("Public URL:", publicUrl);
            return { url: publicUrl, path: filePath };
        }
        catch (error) {
            console.error("File upload error:", error);
            if (error instanceof HttpError) {
                throw error;
            }
            throw new HttpError(500, `Failed to upload video: ${error.message}`);
        }
    },
    async deleteFile(filePath, type) {
        try {
            const bucket = type === "image" ? STORAGE_BUCKETS.IMAGES : STORAGE_BUCKETS.VIDEOS;
            console.log("Deleting file from Supabase Storage:");
            console.log("Bucket:", bucket);
            console.log("File path:", filePath);
            const { error } = await supabase.storage
                .from(bucket)
                .remove([filePath]);
            if (error) {
                // If file doesn't exist, consider it already deleted
                if (error.message.includes("not found") || error.message.includes("does not exist")) {
                    console.log("File not found, considering it already deleted");
                    return { success: true };
                }
                throw new HttpError(500, `Failed to delete file: ${error.message}`);
            }
            console.log("File deleted successfully from Supabase");
            return { success: true };
        }
        catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }
            throw new HttpError(500, `Failed to delete file: ${error.message}`);
        }
    },
};
//# sourceMappingURL=upload.service.js.map