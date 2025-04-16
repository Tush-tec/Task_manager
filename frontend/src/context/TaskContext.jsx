  import { createContext, useContext, useState } from "react"
  import {
    createTaskforUser,
    deleteTaskForUser,
    getAllTask,
    getTaskById,
    getTaskforUser,
    getTaskProgress,
    getTaskProgressForAdmin,
    updateTaskForUser,
    updateTaskStatus,
  } from "../api/api"
  import { requestHandler } from "../utils/accessory"
  import Loader from "../Component/Loader"

  const taskContext = createContext({
    task: [],
    createTask:async () => {},
    getTask: async () => {},
    getTaskByIdForUser:  async () => {},
    getTaskWorker: async () => {},
    updateStatusForTask : async () => {},
    updateTask: async () => {},
    deleteTask: async () => {},
    taskProgress : async () => {},
    taskProgressForAdmin :  async () => {}
  })


  export const useTask = () => useContext(taskContext)

  export const TaskProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [task, setTask] = useState([])
    const [error, setError] = useState(null)
    const [taskCount, setTaskCount] = useState(0)
    const [taskList, setTaskList] = useState([])
    const [taskListCount, setTaskListCount] = useState(0)
    const [taskListFilter, setTaskListFilter] = useState([])
    const [taskListFilterCount, setTaskListFilterCount] = useState(0)

    const createTask = async (data) => {
      setIsLoading(true);

      const task = {
        ...data,
        assignedTo: Array.isArray(data.assignedTo) ? data.assignedTo : [data.assignedTo],
      }
      await requestHandler(
        () => createTaskforUser(task),
        setIsLoading,
        async (res) => {
          await getTask(); 
          setError(null);
        },
        (err) => {
          console.log(err);
          setError(err);
        }
      );
    };

    const getTask = async () => {
      setIsLoading(true)
      await requestHandler(
        getAllTask,
        setIsLoading,
        (res) => {                
          setTaskList(res.task)

          setTaskListCount(res.task.length)
          setError(null)
        },
        (err) => setError(err)
      )
    }

    const getTaskByIdForUser = async (taskId) => {

      setIsLoading(true)

      await requestHandler(
        () => getTaskById (taskId),
        setIsLoading,
        (res) => {
          // console.log("res from id", res.data)
          setTask(res.data)
          // setTaskListCount(res.task.length)
          setError(null)
          
        },
        (err) => {
          console.log(err);
          setError(err);
        }

      )
    }

    const getTaskWorker = async (taskId) => {
      setIsLoading(true)
      await requestHandler(
        () => getTaskforUser(taskId),
        setIsLoading,
        (res) => {

          setTask(res.data)
          setTaskListCount(res.data.length)
          setError(null)
        },
        (err) => setError(err)
      )
    }


    const updateStatusForTask = async (taskId, status) => {
      setIsLoading(true);
    
      await requestHandler(
        () => updateTaskStatus(taskId, status),
        setIsLoading,
        (res) => {
          // Immediately update the task state with new status
          setTask((prevTask) => ({
            ...prevTask,
            status: status,
          }));
    
          setError(null);
        },
        (err) => {
          console.log("error from update status", err);
          setError(err);
        }
      );
    };
    


    const updateTask = async (taskId, updatedData) => {
      setIsLoading(true)
      await requestHandler(
        () => updateTaskForUser(taskId, updatedData),
        setIsLoading,
        (res) => {
          setTaskList((prev) =>
            prev.map((item) => (item._id === taskId ? res.data : item))
          )
          setError(null)
        },
        (err) => setError(err)
      )
    }

    const deleteTask = async (taskId) => {
      setIsLoading(true)
      await requestHandler(
        () => deleteTaskForUser(taskId),
        setIsLoading,
        (res) => {
          setTaskList((prev) => prev.filter((item) => item._id !== taskId))
          setTaskCount((prev) => prev - 1)
          setError(null)
        },
        (err) => setError(err)
      )
    }

    const taskProgress = async (workerId) => {

      setIsLoading(true)
      await requestHandler(
        () => getTaskProgress(workerId) ,
        setIsLoading,
        (res) =>{ 
          console.log("res from task progress", res)


          setTask(res.data)
          setError(null)
        },
        (err) => {
          setError(err) 
        }
      )
    }

    const taskProgressForAdmin = async () => {

      setIsLoading(true)
      await requestHandler(
        () => getTaskProgressForAdmin() ,
        setIsLoading,
        (res) =>{ 
          console.log("res from admin task", res);

          setTask(res.data)
          setError(null)
        },
        (err) => {
          setError(err) 
        }
      )
    }

    return (
      <taskContext.Provider
        value={{
          isLoading,
          error,
          task,
          taskCount,
          taskList,
          taskListCount,
          taskListFilter,
          taskListFilterCount,
          createTask,
          getTask,
          getTaskByIdForUser,
          getTaskWorker,
          updateStatusForTask,
          updateTask,
          deleteTask,
          taskProgress,
          taskProgressForAdmin
        }}
      >

  {children}


      </taskContext.Provider>
    )
  }
