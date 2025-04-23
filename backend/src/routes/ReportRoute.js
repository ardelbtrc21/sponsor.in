import express from "express";
import { newReport } from "../controllers/ReportControllers.js";

const router = express.Router();

router.post("/", newReport);  // hanya "/" karena prefix sudah /api/report

export default router;