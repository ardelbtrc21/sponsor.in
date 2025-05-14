import express from "express";
import { createMilestones, getMilestoneById, getMilestonesByProposalId, getPendingMilestonesByUsername, getStatusBySubmissionId, updateMilestoneStatus, addReplyMilestone, patchMilestoneRevision } from "../controllers/MilestoneControllers.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import mime from "mime-types"

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const milestoneFolder = path.join(__dirname, "../../data/milestone");
router.post("/api/milestones/create", createMilestones);
router.get("/api/milestones/status/:proposal_status_id", getStatusBySubmissionId);
router.get('/api/milestones/pending/:username', getPendingMilestonesByUsername);
router.get("/api/milestones/:milestone_id", getMilestoneById); 
router.get("/api/milestones/proposals/:proposal_id", getMilestonesByProposalId); 
router.put("/api/milestones/:milestone_id/status", updateMilestoneStatus); 
router.patch("/api/milestones/reply", addReplyMilestone); 
router.patch("/api/milestones/update/:milestone_id", patchMilestoneRevision);
router.get("/api/milestones/preview/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(milestoneFolder, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  const mimeType = mime.lookup(filename) || "application/octet-stream";
  console.log(mimeType)
  res.setHeader("Content-Type", mimeType);

  res.sendFile(filePath);
});
export default router;