export declare const authService: {
    register(input: {
        email: string;
        phone: string;
        password: string;
        roles: string[];
    }): Promise<{
        user: {
            id: any;
            email: any;
            phone: any;
            roles: any;
        };
        accessToken: string;
        refreshToken: string;
        devVerification: {
            emailCode: string;
            phoneCode: string;
        };
    }>;
    login(input: {
        emailOrPhone: string;
        password: string;
    }): Promise<{
        user: {
            id: any;
            email: any;
            phone: any;
            emailVerified: any;
            phoneVerified: any;
            roles: any;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(input: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
    }>;
    verifyEmail(userId: string, code: string): Promise<{
        ok: boolean;
    }>;
    verifyPhone(userId: string, code: string): Promise<{
        ok: boolean;
    }>;
    checkFirebaseEmailVerification(input: {
        idToken: string;
    }): Promise<{
        emailVerified: boolean;
        message: string;
    }>;
    checkFirebasePhoneVerification(input: {
        idToken: string;
    }): Promise<{
        phoneVerified: boolean;
        phoneNumber: any;
        message: string;
    }>;
    googleAuth(input: {
        idToken: string;
    }): Promise<{
        user: {
            id: any;
            email: any;
            phone: any;
            roles: any;
        };
        accessToken: string;
        refreshToken: string;
        isNewUser: boolean;
    }>;
    firebaseAuth(input: {
        idToken: string;
        phone?: string;
        roles?: string[];
    }): Promise<{
        user: {
            id: any;
            email: any;
            phone: any;
            roles: any;
            emailVerified: any;
        };
        accessToken: string;
        refreshToken: string;
        isNewUser: boolean;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map