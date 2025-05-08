import express from "express";
import { createProposal, doApprovalProposal, getAllProposals, getCompletedAgreements, getProposalByStatus, getProposals, getProposalStatusByProposalId, getUserByUsername } from "../controllers/ProposalControllers.js";
import { checkUserRole, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.post("/api/create-proposal", verifyUser, checkUserRole(["Sponsoree"]), createProposal);
router.post("/api/proposals", verifyUser, checkUserRole(["Sponsoree", "Sponsor", "Admin"]), getProposals);
router.put("/:status_id/approve", doApprovalProposal);
router.get("/api/proposals/list", getAllProposals);
router.get("/api/proposals/status/:username/:status_name", getProposalByStatus);
router.get("/api/proposals/:proposal_id/status", getProposalStatusByProposalId);
router.get("/api/agreements/history", getCompletedAgreements);
router.get("/api/users/:username", getUserByUsername);

export default router;
