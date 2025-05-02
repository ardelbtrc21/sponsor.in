import express from "express";
import { createProposal, getProposals } from "../controllers/ProposalControllers.js";
import { verifyUser, checkUserRole } from "../middleware/AuthUser.js";

const router = express.Router();

router.post("/api/create-proposal", verifyUser, checkUserRole(["Sponsoree"]), createProposal);
router.get("/api/proposals", verifyUser, checkUserRole(["Sponsoree", "Sponsor", "Admin"]), getProposals);

export default router;
