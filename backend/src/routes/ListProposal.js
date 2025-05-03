import express from "express";
import { getAllProposals } from "../controllers/ListProposalController.js";

const router = express.Router();
router.get("/list", getAllProposals);

export default router;