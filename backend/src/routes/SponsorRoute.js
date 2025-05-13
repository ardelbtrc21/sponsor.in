import express from "express";
import {
  approveSponsor,
  getAllSponsors,
  getPendingSponsors,
  getSponsorById,
  rejectSponsor
} from "../controllers/SponsorControllers.js";
import { checkUserRole, verifyUser } from "../middleware/AuthUser.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nibFolder = path.join(__dirname, "../../data/nib");

router.get("/api/sponsors", getAllSponsors);
router.get("/api/sponsors/:id", getSponsorById);
router.get("/api/pending-sponsors", verifyUser, checkUserRole(["Admin"]), getPendingSponsors);
router.put("/api/approve-sponsor/:username", approveSponsor);
router.put("/api/reject-sponsor/:username", rejectSponsor);
router.get("/api/sponsors/preview/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(nibFolder, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(filePath);
})
export default router;