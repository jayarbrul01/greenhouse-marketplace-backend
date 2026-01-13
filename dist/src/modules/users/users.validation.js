import { z } from "zod";
export const UpdateMeSchema = z.object({
    body: z.object({
        fullName: z.string().min(1).optional(),
        region: z.string().min(1).optional(),
        preferredLanguage: z.enum(["en", "es", "fr"]).optional()
    })
});
export const UpdatePrefsSchema = z.object({
    body: z.object({
        notifyEmail: z.boolean().optional(),
        notifySms: z.boolean().optional(),
        notifyInApp: z.boolean().optional()
    })
});
//# sourceMappingURL=users.validation.js.map