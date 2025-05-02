import express from "express";
import { createProposal, doApprovalProposal, getCompletedAgreements, getProposalByStatus, getProposalStatusByProposalId, getProposals } from "../controllers/ProposalControllers.js";
import { verifyUser, checkUserRole } from "../middleware/AuthUser.js";

const router = express.Router();

router.post("/api/create-proposal", verifyUser, checkUserRole(["Sponsoree"]), createProposal);
router.get("/api/proposals", verifyUser, checkUserRole(["Sponsoree", "Sponsor", "Admin"]), getProposals);
router.put("/:status_id/approve", doApprovalProposal);
router.get("/status/:username/:status_name", getProposalByStatus);
router.get("/:proposal_id/status", getProposalStatusByProposalId);

router.get("/history", getCompletedAgreements);

export default router;
