import express from "express";
import { createUser, getUserById, getUsers, updateUserAccount, changePassword, deleteUser, banAccount, editProfile } from "../controllers/UserControllers.js";
import { verifyUser, checkUserRole } from "../middleware/AuthUser.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sponsorshipFolder = path.join(__dirname, "../../data/sponsorship_photo");
router.post("/api/user", createUser);
router.get("/api/users", verifyUser, checkUserRole(["Admin", "Sponsor", "Sponsoree"]), getUsers);
router.get("/api/user/:username", verifyUser, getUserById);
router.patch("/api/updateUserAccount", verifyUser, updateUserAccount);
router.post("/api/changePassword", verifyUser, changePassword);
router.delete("/api/user", verifyUser, deleteUser);
router.patch("/api/banAccount", verifyUser, banAccount);
router.patch("/api/editProfile", verifyUser, editProfile);
router.get("/api/sponsorship_photos/preview/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(sponsorshipFolder, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Content-Type", "image/jpeg"); // atau sesuaikan berdasarkan ekstensi file
    res.sendFile(filePath);
});

export default router;