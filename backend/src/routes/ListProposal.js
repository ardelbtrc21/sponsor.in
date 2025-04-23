import express from "express";
import { getAllSubmissions } from "../controllers/ListProposalController.js";

const router = express.Router();
router.get("/submissions", getAllSubmissions);

export default router;