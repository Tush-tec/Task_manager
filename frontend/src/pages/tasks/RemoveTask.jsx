import React, { useEffect, useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { Trash2, Search } from 'lucide-react';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import Sidebar from '../../Component/Sidebar';

const statusMap = {
  done: 'Completed',
  pending: 'Pending',
  in_progress: 'In Progress',
  not_started: 'Not Started',
  blocked: 'Blocked',
};

const RemoveTask = () => {
  const { getTask, taskList, deleteTask, isLoading } = useTask();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    getTask();
  }, []);

  const filteredTasks = taskList.filter((task) => {
    const matchSearch = (task.tittle || task.title || '')
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      filterStatus === 'All' || task.status.toLowerCase() === filterStatus.toLowerCase();

    return matchSearch && matchStatus;
  });

  const statusColorMap = {
    done: 'text-green-600',
    pending: 'text-red-500',
    in_progress: 'text-blue-500',
    not_started: 'text-yellow-500',
    blocked: 'text-gray-500',
  };
  

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 border-r bg-white h-full">
        <Sidebar />
      </aside>
  
      <main className="flex-1 h-full overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Manage & Remove Tasks
          </h2>
  
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              {/* <Search className="absolute top-3 left-3 text-gray-400" size={18} />   */}
              <Input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
  
            <select
              className="border rounded-lg px-3 py-2 w-full md:w-1/3 text-gray-700"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Completed</option>
              <option value="not_started">Not Started</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
  
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center text-gray-500">No tasks found.</div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between bg-white p-4 rounded-xl shadow border hover:shadow-md transition"
                >
                  <div className='flex flex-col justify-center gap-1'>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {task.tittle || task.title}
                    </h4>
                    <p className={` text-sm font-semibold px-3 py-1 rounded-full inline-block border ${statusColorMap[task.status] || 'text-gray-500'}`}>
                      Status: {statusMap[task.status] || task.status}
                    </p>
                  </div>
  
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
  
};

export default RemoveTask;
