import { z } from "zod";
export declare const RegisterSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        phone: z.ZodString;
        password: z.ZodString;
        roles: z.ZodArray<z.ZodEnum<{
            BUYER: "BUYER";
            SELLER: "SELLER";
            WISHLIST: "WISHLIST";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const LoginSchema: z.ZodObject<{
    body: z.ZodObject<{
        emailOrPhone: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const VerifyEmailSchema: z.ZodObject<{
    body: z.ZodObject<{
        code: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const VerifyPhoneSchema: z.ZodObject<{
    body: z.ZodObject<{
        code: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const RefreshSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const GoogleAuthSchema: z.ZodObject<{
    body: z.ZodObject<{
        idToken: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const FirebaseAuthSchema: z.ZodObject<{
    body: z.ZodObject<{
        idToken: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        roles: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            BUYER: "BUYER";
            SELLER: "SELLER";
            WISHLIST: "WISHLIST";
        }>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const CheckFirebaseVerificationSchema: z.ZodObject<{
    body: z.ZodObject<{
        idToken: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=auth.validation.d.ts.map