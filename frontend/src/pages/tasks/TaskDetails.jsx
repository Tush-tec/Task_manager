import React, { useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TaskDetails = () => {
  const { taskList, getTask } = useTask();

  useEffect(() => {
    getTask();
  }, []);

  return (
    <div className="p-4">
      {taskList && taskList.length > 0 ? (
        <div className="overflow-auto rounded-xl shadow-lg">
          <table className="min-w-full table-auto bg-white rounded-xl overflow-hidden border border-indigo-200">
            <thead className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Assigned Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            <tbody>
              {taskList.map((task, index) => (
                <motion.tr
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${
                    index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                  } hover:bg-indigo-50 hover:shadow-md transition rounded`}
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <Link to={`/task/${task._id}`} className="text-gray-800 hover:underline">
                      {task.tittle}
                    </Link>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <Link to={`/task/${task._id}`} className="text-gray-800 hover:underline">
                      {Array.isArray(task.assignedTo)
                        ? task.assignedTo.map((user, i) => (
                            <span key={i}>
                              {user.email || 'N/A'}
                              {i < task.assignedTo.length - 1 ? ', ' : ''}
                            </span>
                          ))
                        : task.assignedTo?.email || 'N/A'}
                    </Link>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    <Link to={`/task/${task._id}`} className="text-gray-800 hover:underline">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </Link>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-xs text-white shadow ${
                        task.status === 'done'
                          ? 'bg-emerald-500'
                          : task.status === 'working'
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                    >
                      {task.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg mt-8">No tasks available.</p>
      )}
    </div>
  );
};

export default TaskDetails;
