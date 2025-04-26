import express from "express";
import { createProposal } from "../controllers/ProposalControllers.js";

const router = express.Router();

router.post("/", createProposal);

export default router;
