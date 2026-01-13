import "dotenv/config";
function req(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env: ${name}`);
    return v;
}
export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "4000", 10),
    DATABASE_URL: req("DATABASE_URL"),
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
    JWT_ACCESS_SECRET: req("JWT_ACCESS_SECRET"),
    JWT_REFRESH_SECRET: req("JWT_REFRESH_SECRET"),
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "216743925444-3lcjuuf86k79v0781fsnoo2p7j65h3fp.apps.googleusercontent.com",
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "mail-authentication-d0a3b"
};
//# sourceMappingURL=env.js.map