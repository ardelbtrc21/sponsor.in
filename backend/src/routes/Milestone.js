import express from "express";
import { createMilestones, getStatusBySubmissionId } from "../controllers/MilestoneControllers.js";

const router = express.Router();
router.post("/milestones", createMilestones);
router.get("/status/:submissionId", getStatusBySubmissionId);

export default router;