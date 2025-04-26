import express from "express";
import { newReport } from "../controllers/ReportControllers.js";

const router = express.Router();

router.post("/", newReport);

export default router;