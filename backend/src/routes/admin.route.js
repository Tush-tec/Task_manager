import express from "express";

import { createAdmin, deleteSubAdmin, getAllsubAdmin, loginAdmin, logout, toggleWorkerRole } from "../controller/create.admin.js";
import { authenticateMiddle, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/register", createAdmin);


router.post("/login", loginAdmin);


router.post("/logout",authenticateMiddle , isAdmin, logout);

router.patch("/toggle-role/:workerId", authenticateMiddle, isAdmin, toggleWorkerRole);

router.get("/get-subadmin", authenticateMiddle, isAdmin, getAllsubAdmin);

router.delete("/delete-subAdmin/:workerId", authenticateMiddle, isAdmin, deleteSubAdmin);

export default router;
