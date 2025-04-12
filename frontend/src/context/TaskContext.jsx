import { createContext, useContext, useState } from "react"
import {
  createTaskforUser,
  deleteTaskForUser,
  getAllTask,
  getTaskforUser,
  updateTaskForUser,
} from "../api/api"
import { requestHandler } from "../utils/accessory"
import Loader from "../Component/Loader"

const taskContext = createContext({
  createTask:async () => {},
  getTask: async () => {},
  getTaskById: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {}
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
    await requestHandler(
      () => createTaskforUser(data),
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
        console.log(res);
        
        setTaskList(res.task)

        setTaskListCount(res.task.length)
        setError(null)
      },
      (err) => setError(err)
    )
  }

  const getTaskById = async (taskId) => {
    setIsLoading(true)
    await requestHandler(
      () => getTaskforUser(taskId),
      setIsLoading,
      (res) => {
        setTask(res.data)
        setError(null)
      },
      (err) => setError(err)
    )
  }

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
        getTaskById,
        updateTask,
        deleteTask
      }}
    >

{children}


    </taskContext.Provider>
  )
}
