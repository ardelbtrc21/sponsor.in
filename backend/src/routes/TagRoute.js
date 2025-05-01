import express from "express";
import { getAllTags } from "../controllers/TagControllers.js";

const router = express.Router();

router.get("/api/tags", getAllTags);

export default router;