import mongoose, { isValidObjectId } from "mongoose";
import { Task } from "../modelSchema/task.model.js";
import { Worker } from "../modelSchema/worker.model.js";
import { mailer } from "../../utils/mail.js";

const createTask = async (req,res) => {

    try {
        const {tittle, description,assignedTo,dueDate} = req.body
    
        if(!tittle || !description  || !dueDate){
            return res
            .status(400)
            .json({
              
              success:false,
              message: "Please fill in all fields"})
        }

        const assignedUser = await Worker.findById(assignedTo)

        if(!assignedUser){
            return res
            .status(404)
            .json({
              success:false,message: "Assigned user not found"})
        }

        


    
        const task = await Task.create(
            {
                tittle,
                description,
                assignedTo,
                dueDate
    
            }
        )
    
        if(!task){
            return res
            .status(500)
            .json({success:false,message: "Failed to create task"})
        }
    
        return res
        .status(200)
        .json(
            {   success : true,
                message : `Task is Created & given to ${assignedUser.username}`,
                status :200,
                task : task
            }
        )
    } catch (error) {
        return res
        .status(500)
        .json(
            {   
              success : false,
                message : "Internal Server Error",
                status :500,
                error: error
        
            }
        )
    }

}

const getAllTasks = async (req,res) => {
    try {
        const task =  await Task.find().populate("assignedTo", "username email")
        if(!task){
            return res
            .status(404)
            .json({
              success :false,
              message: "No task found"})
        }

        return res
        .status(200)
        .json(
            { success : true,
                message : "Task is Retrieved",
                status :200,
                task : task
            }
        )
    } catch (error) {
        return res
        .status(500)
        .json(
            {   success : false,
                message: "Failed to retrieve task",
                status :500,
                error: error.message
            }
        )
    }
}


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
          title: 1,
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

          }
        }
      },
      {
        $sort: { dueDate: 1 }
      },
      {
        $skip: (parseInt(page) - 1) * parseInt(limit)
      },
      {
        $limit: parseInt(limit)
      }
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
          success :false,
          message: "Invalid task ID" });
      }
  
      const task = await Task.findById(taskId).populate({
        path: "assignedTo",
        select: "username email",
      });
  
      if (!task) {
        return res.status(404).json({ 
          success :false,

          message: "No task assigned yet. You're all caught up!" });
      }
  
      return res.status(200).json({
        success: true,
        message: `Task assigned to user ${task.assignedTo?.username || "Unknown"}`,
        taskCount: 1,
        data: task, 
      });
    } catch (error) {
      return res.status(500).json({
        success :false,
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
          return res.status(404).json({ message: "Worker not found to assign task" });
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
        const text = `Hello ${newAssignee.username},\n\nYou have been assigned a new task:\n\nTitle: ${task.tittle}\nDescription: ${task.description}\nDue Date: ${new Date(task.dueDate).toDateString()}\n\nPlease log in to your dashboard to view the details.\n\nThanks,\nTask Manager Admin`;
        
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
  

      if (task.assignedTo.toString() == user.toString()) {
        return res.status(403).json({
          message: "You are not authorized to update this task",
          status: 403,
        });
      }
  

      if (task.status.toLowerCase() === "done") {
        return res.status(400).json({
          message: "Task is already marked as done and cannot be updated",
          status: 400,
        });
      }
  

      if (!status || typeof status !== "string" || !status.includes(status.toLowerCase())) {
        return res.status(400).json({
          message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
          status: 400,
        });
      }
  

      task.status = status.toLowerCase();
      await task.save();
  
      return res.status(200).json({
        message: "Task status updated successfully",
        status: 200,
        updatedStatus: task.status,
      });
  
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        error: error.message,
      });
    }
  };
  

const deleteTask = async(req,res) =>{ 

   try {
     const {taskId} = req.params
 
     if(!isValidObjectId(taskId)){
         return res
         .status(400)
         .json(
             {
                 message: "Invalid task id"
             }
         )
     }
     
 
     const task = await Task.findByIdAndDelete(
         taskId
     )
     
     if(!task){
         return res
         .status(500)
         .json(
             {
                 message: "Task is not Delete because of internal serverErrror",
             }
         )
     }

     return res
     .status(200)
     .json(
        {
            message: "Task is deleted successfully",
            status :200
            
        }
     )
   } catch (error) {
        return res
        .status(500)
        .json(
            {
                message: "Internal Server Error",
                status :500,
                error:error.message
            }
        )
   }
}


export {
    createTask,
    getAllTasks,
    getTaskForWorker,
    getTaskById,
    updateTaskById,
    updateTaskStatus,
    deleteTask

}