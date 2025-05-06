import express from "express";
import { newReport, getListReports, rejectReport } from "../controllers/ReportControllers.js";

const router = express.Router();

router.post("/api/report", newReport);
router.post("/api/list-reports", getListReports);
router.patch("/api/reject-report/:id", rejectReport);

export default router;