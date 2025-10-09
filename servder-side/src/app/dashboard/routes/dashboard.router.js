import express from "express";
import { dashboardController } from "../dashboard.module.js";

const router = express.Router();

router.get("/", dashboardController.dashboard.bind(dashboardController))

export default router;