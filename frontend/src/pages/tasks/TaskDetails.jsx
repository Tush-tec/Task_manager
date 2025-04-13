import React, { useEffect, useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const TaskDetails = () => {
  const { taskList, getTask } = useTask();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getTask();
  }, []);

  const filteredTasks = taskList?.filter((task) => {
    const title = task.tittle?.toLowerCase();
    const emails = Array.isArray(task.assignedTo)
      ? task.assignedTo.map((u) => u.email).join(', ')
      : task.assignedTo?.email;

    const status = task.status?.toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      title?.includes(query) ||
      emails?.toLowerCase().includes(query) ||
      status?.includes(query)
    );
  });

  return (
    <>
   
    <div className="p-4">

    <div className="flex justify-between w-full border bg-zinc-600 p-5 rounded-3xl items-center mb-4 sticky top-0">
  <h2 className="text-xl font-bold text-white">Task Details</h2>

  <div className="flex items-center gap-2 bg-zinc-700 px-3 py-2 rounded-lg w-full max-w-md">
    <FaSearch className="text-white" />
    <input
      type="text"
      placeholder="Search by title, email, or status..."
      className="bg-transparent outline-none text-white text-sm w-full"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
</div>

     

      {filteredTasks && filteredTasks.length > 0 ? (
        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full table-auto bg-white text-sm text-left border-collapse">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 border">Title</th>
                <th className="px-4 py-3 border">Assigned Email</th>
                <th className="px-4 py-3 border">Due Date</th>
                <th className="px-4 py-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <motion.tr
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="px-4 py-3 border">
                    <Link to={`/task/${task._id}`} className="hover:underline text-indigo-600">
                      {task.tittle}
                    </Link>
                  </td>

                  <td className="px-4 py-3 border text-gray-700">
                    {Array.isArray(task.assignedTo)
                      ? task.assignedTo.map((user, i) => (
                          <span key={i}>
                            {user.email || 'N/A'}
                            {i < task.assignedTo.length - 1 ? ', ' : ''}
                          </span>
                        ))
                      : task.assignedTo?.email || 'N/A'}
                  </td>

                  <td className="px-4 py-3 border text-gray-600">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                  </td>

                  <td className="px-4 py-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold text-white shadow ${
                        task.status === 'done'
                          ? 'bg-green-500'
                          : task.status === 'working'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
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

    </>
  );
};

export default TaskDetails;
