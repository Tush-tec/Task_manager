import React, { useEffect } from 'react'
import { useTask } from '../../context/TaskContext'

const TaskDetails = () => {
  const { taskList, getTask } = useTask()

  useEffect(() => {
    getTask()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">📋 All Tasks</h2>

      {taskList && taskList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {taskList.map((task) => (
            <div
              key={task._id}
              className="bg-gray-800 text-white rounded-xl p-6 shadow-lg hover:shadow-blue-500 transition"
            >
              <h3 className="text-xl font-semibold text-center mb-3">
                <span className="text-yellow-400">Title:</span>{' '}
                <span className="text-white">{task.tittle}</span>
              </h3>

              <p className="mb-4">
                <span className="text-yellow-400 font-medium">Description:</span>{' '}
                <span className="text-gray-300">{task.description}</span>
              </p>

              <div className="text-sm text-gray-300 mb-4 space-y-1">
                <p>
                  <span className="text-yellow-400 font-medium">Assigned To:</span>{' '}
                  {task.assignedTo.username}
                </p>
                <p>
                  <span className="text-yellow-400 font-medium">Email:</span>{' '}
                  {task.assignedTo.email}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold 
                    ${task.status === 'done' ? 'bg-green-500' : 'bg-yellow-500'}`}
                >
                  {task.status.toUpperCase()}
                </span>
                <span className="text-sm text-gray-300">
                  <span className="text-yellow-400 font-medium">Due:</span>{' '}
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No tasks available.</p>
      )}
    </div>
  )
}

export default TaskDetails
