import { z } from "zod";

export const RegisterFCMTokenSchema = z.object({
  body: z.object({
    fcmToken: z.string().min(1, "FCM token is required"),
  }),
});
