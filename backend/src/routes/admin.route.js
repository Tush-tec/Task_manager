import express from "express";

import { createAdmin, deleteSubAdmin, getAllsubAdmin, getManageableUsers, loginAdmin, logout, toggleWorkerRole } from "../controller/create.admin.js";
import { authenticateMiddle, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/register", createAdmin);


router.post("/login", loginAdmin);


router.post("/logout",authenticateMiddle , isAdmin, logout);

router.post("/assign/invites", authenticateMiddle, isAdmin, )

router.patch("/toggle-role/:workerId", authenticateMiddle, isAdmin, toggleWorkerRole);

router.get('/manage-worker',  authenticateMiddle, isAdmin, getManageableUsers)

router.get("/get-subadmin", authenticateMiddle, isAdmin, getAllsubAdmin);

router.delete("/delete-subAdmin/:workerId", authenticateMiddle, isAdmin, deleteSubAdmin);

export default router;
