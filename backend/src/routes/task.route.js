import { Router } from "express";
import { createTask, deleteTask, getAllTasks, getTaskById, getTaskForWorker, updateTaskById, updateTaskStatus } from "../controller/task.controller.js";
import { authenticateMiddle, isAdmin,  } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/create-task", ).post(
    authenticateMiddle, isAdmin,
    createTask
)

router.route("/get-all-task").get(
    authenticateMiddle,
    getAllTasks
)

router.route("/get-task-indi/:workerId").get(
    getTaskForWorker
)

router.route("/get-task/:taskId").get(
    authenticateMiddle,
    getTaskById
)

router.route("/update-task/:taskId").patch(
    authenticateMiddle,
    updateTaskById
)

router.route("/update-task-status/:taskId").patch(
    authenticateMiddle,
    updateTaskStatus
)

router.route("/delete-task/:taskId").delete(
    authenticateMiddle,
    deleteTask
)

export default router