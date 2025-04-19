import express from "express";
import { createUser, getUserById, getUsers, updateUserAccount, changePassword, deleteUser } from "../controllers/UserControllers";
import { verifyUser, checkUserRole } from "../middleware/AuthUser";
const router = express.Router();

router.post("/api/user", createUser);
router.get("/api/users", verifyUser, checkUserRole(["Admin", "Sponsor", "Sponsoree"]), getUsers);
router.get("/api/user/:username", verifyUser, getUserById);
router.patch("/api/updateUserAccount", verifyUser, updateUserAccount);
router.post("/api/changePassword", verifyUser, changePassword);
router.delete("/api/user", verifyUser, deleteUser);

export default router;