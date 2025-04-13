import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTask } from '../../context/TaskContext'
import { motion } from 'framer-motion'
import { CalendarIcon, ClockIcon, CheckCircleIcon, UserIcon } from '@heroicons/react/24/outline'
import Sidebar from '../../Component/Sidebar'

const FindTask = () => {
  const { taskId } = useParams()
  const { getTaskByIdForUser, task, updateStatusForTask } = useTask()

  useEffect(() => {
    getTaskByIdForUser(taskId)
  }, [taskId])

  const handleStatusChange = (e) => {

    const newStatus = e.target.value

    updateStatusForTask(task._id, { status: newStatus })
  };


  if (!task) return null

  return (

     
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 px-6 py-8 bg-zinc-50 dark:bg-zinc-700"
      >
        <main className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-zinc-800 shadow-xl rounded-2xl p-6 space-y-6 border border-zinc-200 dark:border-zinc-800">
            
            {/* Title */}
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {task.tittle}
            </h2>

            {/* Highlighted Description */}
            <div className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-zinc-700 dark:text-zinc-300">
              
              {/* Status */}
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-indigo-500" />
                <span className="font-semibold">Status:</span>
                <span className="capitalize">{task.status?.status || task.status}</span>

                <select
                  className="ml-3 px-2 py-1 border rounded-md bg-white dark:bg-zinc-700 dark:border-zinc-600 text-sm"
                  value={task.status?.status || task.status}
                  onChange={handleStatusChange}
                >
                 <option value="pending">Pending</option>
                 <option value="in_progress"> In Progress</option>
                 <option value="issue"> Issue</option>
                 <option value="done"> Done</option>
                </select>
              </div>

              {/* Assigned To */}
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Assigned To:</span> {task.assignedTo?.username}
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">Email:</span> {task.assignedTo?.email}
              </div>
            </div>

            {/* Footer Date Info */}
            <div className="mt-6 border-t pt-4 grid sm:grid-cols-2 gap-4 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  <strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                <span>
                  <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>

          </div>
        </main>
      </motion.div>
    </div>
  )
}

export default FindTask
