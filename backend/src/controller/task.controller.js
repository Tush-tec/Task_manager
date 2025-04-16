import mongoose, { isValidObjectId } from "mongoose";
import { Task } from "../modelSchema/task.model.js";
import { Worker } from "../modelSchema/worker.model.js";
import { mailer } from "../../utils/mail.js";

const createTask = async (req, res) => {
  try {
    const { tittle, description, assignedTo, dueDate } = req.body;

    if (!tittle || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    if (
      !assignedTo ||
      (typeof assignedTo !== "string" && !Array.isArray(assignedTo))
    ) {
      return res.status(400).json({
        success: false,
        message: "Please assign at least one user using a valid email or ID.",
        example: {
          assignedTo: ["user@example.com", "6612a5c8e2a1234567890abc"],
        },
      });
    }

    const checkAssigny = Array.isArray(assignedTo) ? assignedTo : [assignedTo];

    const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const emails = checkAssigny.filter(isEmail);
    const ids = checkAssigny.filter((id) => !isEmail(id));

    const workers = await Worker.find({
      $or: [
        {
          email: {
            $in: emails,
          },
        },
        {
          _id: {
            $in: ids,
          },
        },
      ],
    });

    if (workers.length !== workers.length) {
      return res.status(404).json({
        success: false,
        message:
          "Some assigned users were not found. Please double-check emails or IDs.",
      });
    }

    const workerIds = [...new Set(workers.map((w) => w._id.toString()))];

    const duplicateCheck = await Task.findOne({
      tittle,
      description,
      dueDate,
      assignedTo: { $all: workerIds },
    });

    if (duplicateCheck) {
      return res.status(409).json({
        success: false,
        message: "This task with the same team and details already exists.",
      });
    }
    const task = await Task.create({
      tittle,
      description,
      assignedTo: workerIds,
      dueDate,
    });

    const populatedTask = await Task.findById(task._id).populate(
      "assignedTo",
      "username email"
    );

    return res.status(200).json({
      success: true,
      message: `Task created and assigned to ${workers
        .map((w) => w.username)
        .join(", ")}`,
      status: 200,
      task: populatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

const assignMultipleWorkerToATask = async (req, res) => {
  const { emails } = req.body;
  const { taskId } = req.params;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({
      success: false,
      status: "400",
      message:
        "An array of user emails is required to assign a team to the task.",
    });
  }

  if (!isValidObjectId(taskId)) {
    return res.status(403).json({
      success: false,
      status: "403",
      message: "Invalid task id",
    });
  }

  try {
    const workers = await Worker.find({
      email: {
        $in: emails,
      },
    });

    if (workers.length !== emails.length) {
      return res.status(404).json({
        success: false,
        message: "Some users were not found with the provided emails.",
      });
    }

    const workerIds = workers.map((worker) => worker._id);

    console.log("workerIds", workerIds);

    const assignTaskToTeam = await Task.findByIdAndUpdate(
      taskId,
      {
        assignedTo: workerIds,
      },
      {
        new: true,
      }
    ).populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      message: "Team assigned to task successfully.",
      task: assignTaskToTeam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while assigning team to task.",
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const task = await Task.find().populate("assignedTo", "username email");
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "No task found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task is Retrieved",
      status: 200,
      task: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve task",
      status: 500,
      error: error.message,
    });
  }
};

const getTaskForWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { status, dueDate, projectId, page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(workerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid worker id",
      });
    }

    const matchStage = {
      assignedTo: new mongoose.Types.ObjectId(workerId),
    };

    // Optional filters
    if (status) matchStage.status = status;
    if (dueDate) matchStage.dueDate = new Date(dueDate);
    if (projectId && isValidObjectId(projectId)) {
      matchStage.projectId = new mongoose.Types.ObjectId(projectId);
    }

    const tasks = await Task.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "workers",
          localField: "assignedTo",
          foreignField: "_id",
          as: "workerInfo",
        },
      },
      { $unwind: "$workerInfo" },
      {
        $project: {
          tittle: 1,
          description: 1,
          dueDate: 1,
          status: 1,
          assignedTo: 1,
          projectId: 1,
          createdAt: 1,
          updatedAt: 1,
          workerInfo: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
          },
        },
      },
      {
        $sort: { dueDate: 1 },
      },
      {
        $skip: (parseInt(page) - 1) * parseInt(limit),
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    if (tasks.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No tasks found for this worker.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully.",
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks for worker:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(taskId).populate({
      path: "assignedTo",
      select: "username email",
    });

    if (!task) {
      return res.status(404).json({
        success: false,

        message: "No task assigned yet. You're all caught up!",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Task assigned to user ${
        task.assignedTo?.username || "Unknown"
      }`,
      taskCount: 1,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve task",
      error: error.message,
    });
  }
};

const updateTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { tittle, description, assignedTo, dueDate } = req.body;

    if (!isValidObjectId(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "No task found with this ID." });
    }

    let reassigned = false;
    let newAssignee = null;

    if (assignedTo && assignedTo !== task.assignedTo?.toString()) {
      if (!isValidObjectId(assignedTo)) {
        return res.status(400).json({ message: "Invalid worker ID" });
      }

      newAssignee = await Worker.findById(assignedTo);
      if (!newAssignee) {
        return res
          .status(404)
          .json({ message: "Worker not found to assign task" });
      }

      task.assignedTo = assignedTo;
      reassigned = true;
    }

    if (tittle !== undefined) task.tittle = tittle;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    if (reassigned && newAssignee?.email) {
      const subject = "You have been assigned a new task";
      const text = `Hello ${
        newAssignee.username
      },\n\nYou have been assigned a new task:\n\nTitle: ${
        task.tittle
      }\nDescription: ${task.description}\nDue Date: ${new Date(
        task.dueDate
      ).toDateString()}\n\nPlease log in to your dashboard to view the details.\n\nThanks,\nTask Manager Admin`;

      await mailer({
        to: newAssignee.email,
        subject,
        text,
      });

      console.log(` Email sent to ${newAssignee.email}`);
    }

    return res.status(200).json({
      message: reassigned
        ? `Task updated and assigned to ${newAssignee.username}`
        : "Task updated successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      status: 500,
      error: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const user = req.user?._id;

    console.log(`user ${user}`);

    if (!isValidObjectId(taskId)) {
      return res.status(400).json({
        message: "Invalid task ID",
        status: 400,
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        status: 404,
      });
    }

    console.log("task assigned was", task.assignedTo.toString());
    console.log("task updated by", user.toString());

    if (task.assignedTo.toString() !== user.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this task",
        status: 403,
      });
    }

    if (task.status.toLowerCase() === "done") {
      return res.status(400).json({
        success: false,
        message: "Task is already marked as done and cannot be updated",
        status: 400,
      });
    }

    if (
      !status ||
      typeof status !== "string" ||
      !status.includes(status.toLowerCase())
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
        status: 400,
      });
    }

    task.status = status.toLowerCase();
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      status: 200,
      updatedStatus: task.status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error || error.message,
      status: 500,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
      return res.status(400).json({
        message: "Invalid task id",
      });
    }

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(500).json({
        message: "Task is not Delete because of internal serverErrror",
      });
    }

    return res.status(200).json({
      message: "Task is deleted successfully",
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      status: 500,
      error: error.message,
    });
  }
};

const taskProgressForWorkers = async (req, res) => {
  try {
    const { workerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid worker ID",
      });
    }

    const task = await Task.aggregate([
      {
        $match: { assignedTo: new mongoose.Types.ObjectId(workerId) },
      },
      {
        $facet: {
          totalTask: [{ $count: "count" }],
          statusCount: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          overDueTask: [
            {
              $match: {
                dueDate: { $lte: new Date() },
                status: { $ne: "done" },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const total = task[0].totalTask[0]?.count || 0;
    const overDue = task[0].overDueTask[0]?.count || 0;

    const statusData = task[0].statusCount.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {
        done: 0,
        working: 0,
        issue: 0,
        pending: 0,
      }
    );

    const progress =
      total > 0 ? Math.round((statusData.done / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      message: `Here is your task progress data`,
      data: {
        total,
        overDue,
        ...statusData,
        progress,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      data: {},
    });
  }
};

const taskProgressForAdmin = async (req, res) => {
  try {
    const getWorkers = await Worker.find({ role: "worker" }, "_id name email");

    if (!getWorkers.length) {
      return res.status(404).json({
        success: false,
        message: "No workers found",
      });
    }

    const task = await Task.aggregate([
      {
        $match: {
          assignedTo: {
            $in: getWorkers.map((w) => w._id),
          },
        },
      },
      {
        $facet: {
          totalTasks: [
            {
              $group: {
                _id: "$assignedTo",
                total: { $sum: 1 },
              },
            },
          ],
          statusCounts: [
            {
              $group: {
                _id: {
                  assignedTo: "$assignedTo",
                  status: "$status",
                },
                count: { $sum: 1 },
              },
            },
          ],
          overDueTask: [
            {
              $match: {
                dueDate: { $lte: new Date() },
                status: { $ne: "done" },
              },
            },
            {
              $group: {
                _id: "$assignedTo",
                overDue: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const totalsMap = task[0].totalTasks.reduce((acc, { _id, total }) => {
      acc[_id.toString()] = total;
      return acc;
    }, {});

    const overdueMap = task[0].overDueTask.reduce((acc, { _id, overDue }) => {
      acc[_id.toString()] = overDue;
      return acc;
    }, {});

    const statusMap = task[0].statusCounts.reduce((acc, { _id, count }) => {
      const workerId = _id.assignedTo.toString();
      const status = _id.status;

      if (!acc[workerId]) {
        acc[workerId] = {
          done: 0,
          working: 0,
          issue: 0,
          pending: 0,
        };
      }

      acc[workerId][status] = count;
      return acc;
    }, {});

    const result = getWorkers.map((worker) => {
      const id = worker._id.toString();
      const total = totalsMap[id] || 0;
      const overDue = overdueMap[id] || 0;
      const statusData = statusMap[id] || {
        done: 0,
        working: 0,
        issue: 0,
        pending: 0,
      };
      const progress =
        total > 0 ? Math.round((statusData.done / total) * 100) : 0;

      return {
        workerId: id,
        name: worker.name,
        email: worker.email,
        total,
        overDue,
        ...statusData,
        progress,
      };
    });

    return res.status(200).json({
      success: true,
      message: "All worker task progress fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error || "something went wrong",
    });
  }
};

const TaskStatusFilter = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { status } = req.query;

    const validStatuses = new Set(["pending", "in_progress", "done", "issue"]);

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required",
      });
    }

    const handleMultipleStatus = status.split(",");

    const checkForValidStatus = handleMultipleStatus.some(
      (s) => !validStatuses.has(s)
    );

    if (checkForValidStatus) {
      return res.status(400).json({
        success: false,
        message: `Invalid status values: ${handleMultipleStatus
          .filter((s) => !validStatuses.has(s))
          .join(", ")}`,
      });
    }

    const findTaskStatus = await Task.aggregate([
      {
        $match: {
          assignedTo: new mongoose.Types.ObjectId(workerId),

          status: {
            $in: handleMultipleStatus,
          },
        },
      },
      {
        $unwind: "$assignedTo",
      },
      {
        $lookup: {
          from: "workers",
          localField: "assignedTo",
          foreignField: "_id",
          as: "workerDetails",
        },
      },
      {
        $unwind: "$workerDetails",
      },
      {
        $project: {
          _id: 1,
          tittle: 1,
          description: 1,
          status: 1,
          dueDate: 1,
          createdAt: 1,
          updatedAt: 1,
          assignedTo: 1,
          workerEmail: "$workerDetails.email",
          workerName: "$workerDetails.username",
        },
      },
    ]);

    console.log(findTaskStatus);

    if (findTaskStatus.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found with the provided taskId and status",
      });
    }

    return res.status(200).json({
      success: true,
      data: findTaskStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching task status",
    });
  }
};

export {
  createTask,
  assignMultipleWorkerToATask,
  getAllTasks,
  getTaskForWorker,
  getTaskById,
  updateTaskById,
  updateTaskStatus,
  deleteTask,
  taskProgressForWorkers,
  taskProgressForAdmin,
  TaskStatusFilter,
};
