import express from "express";
import {
  approveSponsor,
  getAllSponsors,
  getPendingSponsors,
  getSponsorById,
  rejectSponsor
} from "../controllers/SponsorControllers.js";
import { checkUserRole, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/api/sponsors", getAllSponsors);
router.get("/api/sponsors/:id", getSponsorById);
router.get("/api/pending-sponsors", verifyUser, checkUserRole(["Admin"]), getPendingSponsors);
router.put("/api/approve-sponsor/:username", approveSponsor);
router.put("/api/reject-sponsor/:username", rejectSponsor);
export default router;