import express from "express";
import { createMilestones, getMilestoneById, getMilestonesByProposalId, getPendingMilestonesByUsername, getStatusBySubmissionId, updateMilestoneStatus, addReplyMilestone } from "../controllers/MilestoneControllers.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

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
router.get("/api/milestones/preview/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(milestoneFolder, filename);
  
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
  
    const extension = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream"; 
    let disposition = "inline";
    
    if (extension === ".pdf") {
      contentType = "application/pdf";
    } else if (extension === ".csv") {
      contentType = "text/csv";
      disposition = "attachment";
    } else if (extension === ".xlsx") {
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      disposition = "attachment";
    }
    
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `${disposition}; filename="${filename}"`);
    res.sendFile(filePath);
  });
  
export default router;