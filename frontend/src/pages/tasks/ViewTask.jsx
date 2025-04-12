import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTask } from '../../context/TaskContext'
import Loader from '../../Component/Loader'

const ViewTask = () => {
  const { taskId } = useParams()
  const { getTaskById, task, isLoading } = useTask()

  useEffect(() => {
    if (taskId) {
      getTaskById(taskId)
    }
  }, [taskId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader />
      </div>
    )
  }

  if (!task || !task._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Task not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-3xl bg-gray-200 rounded-2xl shadow-lg p-8 space-y-6 border border-gray-200 ">
        <h2 className="text-4xl font-bold text-indigo-700">{task.tittle}</h2>

        <div className="space-y-4 text-gray-700 text-lg ">
          <p>
            <span className="font-semibold ">Assigned to:</span>{' '}
            {task.assignedTo?.username || 'N/A'} ({task.assignedTo?.email || 'N/A'})
          </p>
          <p>
            <span className="font-semibold">Due Date:</span>{' '}
            {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{' '}
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                task.status === 'done'
                  ? 'bg-green-100 text-green-800'
                  : task.status === 'working'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {task.status}
            </span>
          </p>
          <p>
            <span className="font-semibold">Description:</span>{' '}
            {task.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ViewTask
