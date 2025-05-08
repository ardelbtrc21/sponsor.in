import express from "express";
import { getPendingSponsors, approveSponsor, rejectSponsor } from "../controllers/AdminController.js";
const router = express.Router();

router.get("/api/admin/pending-sponsors", getPendingSponsors);
router.put("/api/admin/approve-sponsor/:username", approveSponsor);
router.put("/api/admin/reject-sponsor/:username", rejectSponsor);

export default router;