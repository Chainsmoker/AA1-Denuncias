import AuthController from "./auth.controller.js";
import AuthService from "./auth.service.js";

const authController = new AuthController(new AuthService());

export {
    authController
}
