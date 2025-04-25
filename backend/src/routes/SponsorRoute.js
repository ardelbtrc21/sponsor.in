import express from "express";
import {
  getAllSponsors,
  getSponsorById
} from "../controllers/SponsorControllers.js";

const router = express.Router();

router.get("/", getAllSponsors);
router.get("/:id", getSponsorById);
export default router;