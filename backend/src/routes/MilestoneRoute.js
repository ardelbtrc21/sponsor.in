import express from "express";
import { createMilestones, getMilestoneById, getMilestonesByProposalId, getPendingMilestonesByUsername, getStatusBySubmissionId, updateMilestoneStatus, addReplyMilestone } from "../controllers/MilestoneControllers.js";

const router = express.Router();
router.post("/api/milestones/create", createMilestones);
router.get("/api/milestones/status/:proposal_status_id", getStatusBySubmissionId);
router.get('/api/milestones/pending/:username', getPendingMilestonesByUsername);
router.get("/api/milestones/:milestone_id", getMilestoneById); 
router.get("/api/milestones/proposals/:proposal_id", getMilestonesByProposalId); 
router.put("/api/milestones/:milestone_id/status", updateMilestoneStatus); 
router.patch("/api/milestones/reply", addReplyMilestone); 

export default router;