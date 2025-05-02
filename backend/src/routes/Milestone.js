import express from "express";
import { createMilestones, getStatusBySubmissionId } from "../controllers/MilestoneControllers.js";

const router = express.Router();
router.post("/create", createMilestones);
router.get("/status/:proposal_status_id", getStatusBySubmissionId);

export default router;