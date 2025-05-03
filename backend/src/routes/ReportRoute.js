import express from "express";
import { newReport } from "../controllers/ReportControllers.js";

const router = express.Router();

router.post("/api/report", newReport);

export default router;