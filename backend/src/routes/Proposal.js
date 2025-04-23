import express from "express";
import { doApprovalProposal, getProposalByStatus, getProposalStatusBySubmissionId } from "../controllers/ProposalControllers.js";

const router = express.Router();

router.put("/:status_id/approve", doApprovalProposal);
router.get("/status/:status_name", getProposalByStatus);
router.get("/:submission_id/status", getProposalStatusBySubmissionId);
export default router;