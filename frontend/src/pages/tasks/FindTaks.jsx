import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTask } from '../../context/TaskContext'
import { motion } from 'framer-motion'
import { CalendarIcon, ClockIcon, CheckCircleIcon, UserIcon } from '@heroicons/react/24/outline'

const FindTask = () => {
  const { taskId } = useParams()
  const { getTaskByIdForUser, task } = useTask()

  useEffect(() => {
    getTaskByIdForUser(taskId)
  }, [taskId])

  if (!task) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="bg-white dark:bg-zinc-800 shadow-xl rounded-2xl p-6 space-y-6 border border-zinc-200 dark:border-zinc-800">

        {/* Title */}
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{task.tittle}</h2>

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
            <span className="font-semibold">Status:</span> <span className="capitalize">{task.status}</span>
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
            <span><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

      </div>
    </motion.div>
  )
}

export default FindTask
