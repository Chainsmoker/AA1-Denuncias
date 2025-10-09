import express from "express";
import { usersController } from "../users.module.js";

const router = express.Router();

router.get("/users", usersController.users.bind(usersController));

export default router;