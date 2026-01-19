import { z } from "zod";

export const UpdateMeSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).optional(),
    region: z.string().min(1).optional(),
    preferredLanguage: z.enum(["en", "es", "fr"]).optional(),
    avatar: z.string().url().optional().or(z.literal(""))
  })
});

export const UpdatePrefsSchema = z.object({
  body: z.object({
    notifyEmail: z.boolean().optional(),
    notifySms: z.boolean().optional(),
    notifyInApp: z.boolean().optional()
  })
});

export const UpdateRolesSchema = z.object({
  body: z.object({
    roles: z.array(z.enum(["BUYER", "SELLER", "WISHLIST"])).min(1, "At least one role is required")
  })
});
