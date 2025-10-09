import express from "express";
import { accountsController } from "../acocounts.module.js";

const router = express.Router();

router.get("/profile", accountsController.myAccount.bind(accountsController));
router.get("/profile/settings", accountsController.editAccount.bind(accountsController));
router.get("/profile/change-password", accountsController.changePassword.bind(accountsController));

export default router;