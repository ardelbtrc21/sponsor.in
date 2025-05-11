import express from "express";
import { getPendingSponsors, approveSponsor, rejectSponsor } from "../controllers/AdminController.js";
import { checkUserRole, verifyUser } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/api/admin/pending-sponsors", verifyUser, checkUserRole(["Admin"]), getPendingSponsors);
router.put("/api/admin/approve-sponsor/:username", approveSponsor);
router.put("/api/admin/reject-sponsor/:username", rejectSponsor);

export default router;