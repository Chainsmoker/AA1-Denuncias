export default class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async login(req, res) {
        res.render("auth/sign-in", { title: "Iniciar Sesión" });
    }

    async register(req, res) {
        res.render("auth/sign-up", { title: "Registrarse" });
    }

    async forgotPassword(req, res) {
        res.render("auth/forgot-password", { title: "Recuperar Contraseña" });
    }

    async resetPassword(req, res) {
        res.render("auth/reset-password", { title: "Restablecer Contraseña" });
    }
}
