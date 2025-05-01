import express from "express";
import { getAllTargets } from "../controllers/TargetControllers.js";

const router = express.Router();

router.get("/api/targets", getAllTargets);

export default router;