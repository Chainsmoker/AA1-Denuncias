import express from "express";
import { incidentsController } from "../incidents.module.js";

const router = express.Router();

router.get("/incidents", incidentsController.denuncias.bind(incidentsController));
router.get("/incidents/map", incidentsController.map.bind(incidentsController));

export default router;