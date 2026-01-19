import admin from "firebase-admin";
import { env } from "./env.js";

// Initialize Firebase Admin SDK with service account credentials
if (!admin.apps.length) {
  try {
    // Get private key from environment or use the provided one
    const privateKeyEnv = env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = privateKeyEnv 
      ? privateKeyEnv.replace(/\\n/g, '\n')
      : "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDL9O9OnNi4MAyw\n5cFmtR9R+xgnICxS/AQY3TD/vRJyF0WaT1hER3Hp9/Crtkai6zS2CXAzBuTSyzMb\nDjPsC9f/XlqGOAi3DVR5yNGM5XMdPws9f9vojuf051Amnx6RGHZ8HMt60AGAesaY\nw4aVlXK8nGfHJIb59qegspYWyNV6uW8MY7YTiZYU8SF7zFDOs+SXFixE5DALd5g+\neXUv/BTZd/Uvm2OYaOS+aWn99kT8zLCo4yTC5+0dY+3ogViIksSP99KFWsaxbrV2\nemfFFNwMn/q6DWZZtlSJU4VwLAWKAiGNK2o9kU+VTt+97dPsV3JlkNBPdxlpH9/2\neGaVAo4xAgMBAAECggEABTGTeN6Jv5eBpNONfDtVLGCpG+zii4gIB76XibMXVGxL\n9AtlElmj7whPOaAq1T7WEHReilNwJf9Z/xLYYaKbTsAK8ScZVXKmt5SHwhBpuHwR\nxBKMtV55b+uO8hRLnyt1K5zagEy3Bq0AGcmAUFJsqmmOy8V74il/cyK9Vjm6nODq\nkMqDxvK/4V4Zfc/3tdpjlGqZ4eHuY97uWZq26K3cjHgWg9xu6QsDWFpojyzK5JmA\nTcZOcfUihsIV+7JoU7Hu6nPpqWFmPfF5jsBF0kL2uEJOf30zKC8Qo/fmCc8Sh4tP\n8re1KijGXE1bqA97G2AhQo0SeLwiOzb0HXlszvxVrQKBgQD1bdQK2ZYzovfAkmnn\nW/nwBscVYVHNax0nV+BL0ZZe9ZhdYiWODTgu2+/gJjxX2WStdp5JVGfTPmqg9qKd\nYpWKymyFRU8S1M7f2FR4eFWXyvym8pRGEMhGYqRl28ElWoeD7FRZIE7z/0dGtCJ0\nFJhfb6I6f7nwe6cyAB4wDX4oGwKBgQDUvdJPQo/9Ij2+b7CyiKWhVvDzFVeU+zpT\nnJwhX2Iy0+Tcr5YdBoX9uIXFxcQFCfF2FFg7vCnbuxETcZ70dmF0NUEKMOF0FoJG\nTLMdqAf623igw9PmUtYE7pIEiN1xRCvGlLFUI4RSHV6Unhk5OAXy0QuQScAe2iqE\n2PXbnTdfowKBgQCJbC3GxX7s+ttu4IycF0wjsifXON7s/oUceoAE9B4Wnb3qzAHr\nQEutMUlnYQF4zykoV7rZpIFeLxzVdEQpjAHf7OhG10AnczFC9YaWzgpfLDG76ShM\n8yixAJq8zgegOsiWfcXdAdIznUTzuflwtfd7uK5Fwy8CELrVrGs6zNNO8QKBgCvQ\n9NHySam/NaxVYLVEw6hZOcM3MBS1Mawq41VUSetiDQ8O8wIDZ/F74cF8HAVVqO/C\n/PFArfZdrwSsMCr1ftjqZvzsWGMKh8Zm4bVH+GzIay3hZ3FWulHFuTlJ3yIHAmUi\nFuvXbNdkySge798DFOaP+6u6JOG12XAHJ4wV82O1AoGBAJwc4M2JeoohToMIurU6\nNkfw0ebkBpHFnwNVl9MAcaf/wKGsO1gYbx6W5uEaaCz/9HjvAkJwIGoQHjAhhCOF\nxWp1mE0mzzitmf7sNq3ulvmKCdBEAiG3xrjyi2Np5NBSRKYk8DJe2bdXkbmwHlVA\nwovEouLFubXhjtLsYPZidEhK\n-----END PRIVATE KEY-----\n";
    
    if (!privateKey || privateKey.trim() === "" || !privateKey.includes("BEGIN PRIVATE KEY")) {
      throw new Error("FIREBASE_PRIVATE_KEY is missing or invalid. Please set it in your .env file.");
    }

    const serviceAccount = {
      type: "service_account",
      projectId: env.FIREBASE_PROJECT_ID || "mail-authentication-d0a3b",
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID || "248b5765f748aaf367ea1c2f19bf625fbef861b6",
      privateKey: privateKey,
      clientEmail: env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@mail-authentication-d0a3b.iam.gserviceaccount.com",
      clientId: process.env.FIREBASE_CLIENT_ID || "108793551432842542144",
      authUri: "https://accounts.google.com/o/oauth2/auth",
      tokenUri: "https://oauth2.googleapis.com/token",
      authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
      clientX509CertUrl: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@mail-authentication-d0a3b.iam.gserviceaccount.com")}`,
      universeDomain: "googleapis.com"
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: env.FIREBASE_PROJECT_ID || "mail-authentication-d0a3b",
    });
    
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error: any) {
    if (!/already exists/.test(error.message)) {
      console.error("Firebase Admin initialization error", error);
      throw error;
    }
  }
}

export const firebaseAdmin = admin;
