import { authService } from "./auth.service.js";
export const authController = {
    register: async (req, res) => {
        console.log("register: ", req.body);
        const { body } = req.validated;
        const out = await authService.register(body);
        res.json(out);
    },
    login: async (req, res) => {
        const { body } = req.validated;
        const out = await authService.login(body);
        res.json(out);
    },
    refresh: async (req, res) => {
        const { body } = req.validated;
        const out = await authService.refresh(body);
        res.json(out);
    },
    verifyEmail: async (req, res) => {
        const { body } = req.validated;
        const out = await authService.verifyEmail(req.user.id, body.code);
        res.json(out);
    },
    verifyPhone: async (req, res) => {
        const { body } = req.validated;
        const out = await authService.verifyPhone(req.user.id, body.code);
        res.json(out);
    },
    checkFirebaseEmailVerification: async (req, res) => {
        const { body } = req.validated;
        const out = await authService.checkFirebaseEmailVerification(body);
        res.json(out);
    },
    checkFirebasePhoneVerification: async (req, res) => {
        const { body } = req.validated;
        const out = await authService.checkFirebasePhoneVerification(body);
        res.json(out);
    },
    googleAuth: async (req, res) => {
        const { body } = req.validated;
        const out = await authService.googleAuth(body);
        res.json(out);
    },
    firebaseAuth: async (req, res) => {
        const { body } = req.validated;
        const out = await authService.firebaseAuth(body);
        res.json(out);
    }
};
//# sourceMappingURL=auth.controller.js.map