import { z } from "zod";
export declare const UpdateMeSchema: z.ZodObject<{
    body: z.ZodObject<{
        fullName: z.ZodOptional<z.ZodString>;
        region: z.ZodOptional<z.ZodString>;
        preferredLanguage: z.ZodOptional<z.ZodEnum<{
            en: "en";
            es: "es";
            fr: "fr";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const UpdatePrefsSchema: z.ZodObject<{
    body: z.ZodObject<{
        notifyEmail: z.ZodOptional<z.ZodBoolean>;
        notifySms: z.ZodOptional<z.ZodBoolean>;
        notifyInApp: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const UpdateRolesSchema: z.ZodObject<{
    body: z.ZodObject<{
        roles: z.ZodArray<z.ZodEnum<{
            BUYER: "BUYER";
            SELLER: "SELLER";
            WISHLIST: "WISHLIST";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=users.validation.d.ts.map