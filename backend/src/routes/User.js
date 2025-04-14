import express from "express";
import {createUser} from UserController;
import { verifyUser, checkUserRole } from "../middleware/AuthUser";
const router = express.Router();

route.post("/api/createUser", verifyUser, checkUserRole(["Admin", "Sponsoree"]), createUser);