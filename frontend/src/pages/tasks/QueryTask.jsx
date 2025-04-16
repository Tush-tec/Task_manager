import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import Sidebar from '../../Component/Sidebar';
import { motion } from 'framer-motion';

const QueryTask = () => {
  const { workerId } = useParams();
  const { taskQuery, filterTask } = useTask();
  const { search } = useLocation();

  const [searchText, setSearchText] = useState('');
  const status = new URLSearchParams(search).get('status');

  useEffect(() => {
    if (workerId && status) {
      taskQuery({ workerId, status });
    }
  }, [workerId, status]);

  const filteredResults = filterTask?.filter(task =>
    task.tittle?.toLowerCase().includes(searchText.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f0f4ff] to-[#ffffff] text-gray-800 font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md z-10">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-700 mb-6 tracking-tight">
            Tasks: <span className="capitalize text-indigo-600">{status}</span>
          </h1>

          {/* Search Input */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          {/* Task Cards */}
          {Array.isArray(filteredResults) && filteredResults.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResults.map((task, index) => (
                <motion.div
                key={`${task._id}-${index}`}

                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all"
                >
                  <h2 className="text-lg font-bold text-indigo-600 mb-1">{task.tittle}</h2>
                  <p className="text-sm text-gray-500 mb-3">{task.description}</p>

                  <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-semibold text-gray-500">Assigned To:</span> {task.workerName}</p>
                    <p><span className="font-semibold text-gray-500">Email:</span> {task.workerEmail}</p>
                    <p><span className="font-semibold text-gray-500">Created-At:</span> {new Date(task.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-semibold text-gray-500">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}</p>
                    <p><span className="font-semibold text-gray-500">Status:</span> <span className={`font-bold ${task.status === 'done' ? 'text-green-600' : task.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>{task.status}</span></p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-xl font-medium">No tasks match your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QueryTask;
