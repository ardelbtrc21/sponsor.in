import express from "express";
import { newReport, getListReports } from "../controllers/ReportControllers.js";

const router = express.Router();

router.post("/api/report", newReport);
router.post("/api/list-reports", getListReports);

export default router;