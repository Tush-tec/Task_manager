import { isValidObjectId } from "mongoose";
import { Task } from "../modelSchema/task.model.js";
import { Worker } from "../modelSchema/worker.model.js";
import { mailer } from "../../utils/mail.js";

const createTask = async (req,res) => {

    try {
        const {tittle, description,assignedTo,dueDate} = req.body
    
        if(!tittle || !description  || !dueDate){
            return res
            .status(400)
            .json({message: "Please fill in all fields"})
        }

        const assignedUser = await Worker.findById(assignedTo)

        if(!assignedUser){
            return res
            .status(404)
            .json({message: "Assigned user not found"})
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
            .json({message: "Failed to create task"})
        }
    
        return res
        .status(200)
        .json(
            {
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
                message : "Internal Server Error",
                status :500,
                error: error.message
        
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
            .json({message: "No task found"})
        }

        return res
        .status(200)
        .json(
            {
                message : "Task is Retrieved",
                status :200,
                task : task
            }
        )
    } catch (error) {
        return res
        .status(500)
        .json(
            {
                message: "Failed to retrieve task",
                status :500,
                error: error.message
            }
        )
    }
}


const getTask = async (req,res) =>{

    

}

const getTaskById = async (req, res) => {
    try {
      const { taskId } = req.params;
  
      if (!isValidObjectId(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
  
      const task = await Task.findById(taskId).populate({
        path: "assignedTo",
        select: "username email",
      });
  
      if (!task) {
        return res.status(404).json({ message: "No task assigned yet. You're all caught up!" });
      }
  
      return res.status(200).json({
        message: `Task assigned to user ${task.assignedTo?.username || "Unknown"}`,
        taskCount: 1,
        task: [task], 
      });
    } catch (error) {
      return res.status(500).json({
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


const updateTaskStatus = async (req,res) => {
    try {
        const {taskId } = req.params
        const {status} = req.body
        const user = req.user._id

        if(!isValidObjectId(taskId)){
            return res
            .status(400)
            .json(
                {
                    message: "Invalid task id",
                    status :400,
                }
            )   
        }

        const task = await Task.findById(taskId)

        if(!task){
            return res
            .status(404)
            .json(
                {
                    message: "Task not found",
                    status :404,
                }
            )
        }

        if(task.assignedTo.toString() !== user.toString()){
            return res
            .status(403)
            .json(
                {
                    message: "You are not authorized to update this task",
                    status :403,
                }
            )
        }

        task.status = status
        await task.save()

        return res 
        .status(200)
        .json(
            {
                message: "Task status updated successfully",
                status :200,
            }
        )
        
    } catch (error) {
        return res
        .status(500)
        .json(
            {
                message: "Internal server error",
                status :500,
                error : error.message
            }
        )    
    }
}

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
    getTaskById,
    updateTaskById,
    updateTaskStatus,
    deleteTask

}