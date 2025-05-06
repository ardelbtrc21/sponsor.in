import express from "express";
import { createProposal, doApprovalProposal, getProposalByProposalId, getCompletedAgreements, getProposalByStatus, getProposalStatusByProposalId, getProposals } from "../controllers/ProposalControllers.js";
import { verifyUser, checkUserRole } from "../middleware/AuthUser.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const proposalFolder = path.join(__dirname, "../../data/proposal");

router.post("/api/create-proposal", verifyUser, checkUserRole(["Sponsoree"]), createProposal);
router.post("/api/proposals", verifyUser, checkUserRole(["Sponsoree", "Sponsor", "Admin"]), getProposals);
router.get("/api/proposal/:id", verifyUser, checkUserRole(["Sponsoree", "Sponsor", "Admin"]), getProposalByProposalId);
router.put("/:status_id/approve", doApprovalProposal);
router.get("/status/:username/:status_name", getProposalByStatus);
router.get("/:proposal_id/status", getProposalStatusByProposalId);
router.get("/preview/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(proposalFolder, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(filePath);
})

router.get("/history", getCompletedAgreements);

export default router;
