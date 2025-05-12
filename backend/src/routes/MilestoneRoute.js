import express from "express";
import { createMilestones, getMilestoneById, getPendingMilestonesByUsername, getStatusBySubmissionId, updateMilestoneStatus } from "../controllers/MilestoneControllers.js";

const router = express.Router();
router.post("/api/milestones/create", createMilestones);
router.get("/api/milestones/status/:proposal_status_id", getStatusBySubmissionId);
router.get('/api/milestones/pending/:username', getPendingMilestonesByUsername);
router.get("/api/milestones/:milestone_id", getMilestoneById); 
router.put("/api/milestones/:milestone_id/status", updateMilestoneStatus); 

export default router;