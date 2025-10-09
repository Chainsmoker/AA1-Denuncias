import express from "express";
import { authController } from "../auth.module.js";

const router = express.Router();

router.get("/login", authController.login.bind(authController))
router.get("/register", authController.register.bind(authController))
router.get("/forgot-password", authController.forgotPassword.bind(authController))
router.get("/reset-password", authController.resetPassword.bind(authController))

export default router;
