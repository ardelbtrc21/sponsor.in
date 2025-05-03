import express from "express";
import { getPendingSponsors, approveSponsor } from "../controllers/AdminController.js";
const router = express.Router();

router.get("/pending-sponsors", getPendingSponsors);
router.put("/approve-sponsor/:username", approveSponsor);

export default router;