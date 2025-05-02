import express from "express";
import { createProposal, doApprovalProposal, getCompletedAgreements, getProposalByStatus, getProposalStatusByProposalId } from "../controllers/ProposalControllers.js";

const router = express.Router();

router.post("/", createProposal);
router.put("/:status_id/approve", doApprovalProposal);
router.get("/status/:username/:status_name", getProposalByStatus);
router.get("/:proposal_id/status", getProposalStatusByProposalId);

router.get("/history", getCompletedAgreements);

export default router;
