import express from "express";
import { createUser, getUserById, getUsers, updateUserAccount, changePassword, deleteUser, banAccount } from "../controllers/UserControllers.js";
import { verifyUser, checkUserRole } from "../middleware/AuthUser.js";
const router = express.Router();

router.post("/api/user", createUser);
router.get("/api/users", verifyUser, checkUserRole(["Admin", "Sponsor", "Sponsoree"]), getUsers);
router.get("/api/user/:username", verifyUser, getUserById);
router.patch("/api/updateUserAccount", verifyUser, updateUserAccount);
router.post("/api/changePassword", verifyUser, changePassword);
router.delete("/api/user", verifyUser, deleteUser);
router.patch("/api/banAccount", verifyUser, banAccount);

export default router;