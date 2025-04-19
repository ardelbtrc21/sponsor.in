import express from "express";
import { Login, Logout, Me } from "../controllers/AuthControllers.js";

const router = express.Router();

router.get("/api/me", Me);
router.post("/api/login", Login);
router.delete("/api/logout", Logout);

export default router;