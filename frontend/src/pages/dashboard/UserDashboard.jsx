import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../Component/Sidebar';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const { getTaskWorker, task, updateTask, isLoading, taskListCount } = useTask();

  useEffect(() => {
    if (user?._id) {
      getTaskWorker(user._id);
    }
  }, [user]);

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-800 shadow-lg border-r border-gray-200 dark:border-zinc-700 flex-shrink-0">
        <Sidebar />
      </aside>
  
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 p-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">Total Tasks: {taskListCount}</p>
        </header>
  
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
          ) : task?.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No tasks assigned yet.</p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {task.map((t) => (
                <Link key={t._id} to={`${t._id}`}>
                  <div className="bg-white dark:bg-zinc-700 bg-opacity-60 dark:bg-opacity-80 backdrop-filter backdrop-blur-lg shadow rounded-xl p-6 hover:shadow-xl transition-all">
                    <h2 className="font-semibold text-xl text-gray-900 dark:text-white">{t.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{t.description}</p>
                    <p className="text-sm mt-3 text-gray-700 dark:text-gray-200">
                      <strong>Due:</strong> {new Date(t.dueDate).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t._id, e.target.value)}
                        className="border border-gray-300 dark:border-zinc-600 rounded px-2 py-1 bg-white dark:bg-zinc-600 text-gray-900 dark:text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="issue">Issue</option>
                        <option value="done">Done</option>
                      </select>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          t.status === 'pending'
                            ? 'bg-gray-200 text-gray-700'
                            : t.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-700'
                            : t.status === 'done'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
  
};

export default UserDashboard;
