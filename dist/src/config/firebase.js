import admin from "firebase-admin";
import { env } from "./env.js";
// Initialize Firebase Admin SDK
// For production, you should use a service account JSON file for better security
// For development, we can use the project ID
// Set GOOGLE_CLOUD_PROJECT environment variable or use projectId option
if (!admin.apps.length) {
    try {
        // Set the project ID as an environment variable if not already set
        if (!process.env.GOOGLE_CLOUD_PROJECT) {
            process.env.GOOGLE_CLOUD_PROJECT = env.FIREBASE_PROJECT_ID || "mail-authentication-d0a3b";
        }
        admin.initializeApp({
            projectId: env.FIREBASE_PROJECT_ID || "mail-authentication-d0a3b",
            // For production, uncomment and provide service account:
            // credential: admin.credential.cert({
            //   projectId: env.FIREBASE_PROJECT_ID,
            //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            //   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            // })
        });
    }
    catch (error) {
        if (!/already exists/.test(error.message)) {
            console.error("Firebase Admin initialization error", error);
            throw error;
        }
    }
}
export const firebaseAdmin = admin;
//# sourceMappingURL=firebase.js.map