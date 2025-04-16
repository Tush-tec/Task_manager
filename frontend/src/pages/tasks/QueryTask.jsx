import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';

const QueryTask = () => {
  const { workerId } = useParams();
  const { taskQuery, filterTask } = useTask();
  const { search } = useLocation();

  const status = new URLSearchParams(search).get("status");

  useEffect(() => {
    if (workerId && status) {
      taskQuery({ workerId, status });
    }
  }, [workerId, status]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Section */}
      <aside className="w-64 bg-gray-100 border-r border-gray-300 p-4">
        <h2 className="text-lg font-semibold">Sidebar</h2>
        {/* Add actual sidebar content here */}
      </aside>

      {/* Main Content Section */}
      <main className="flex-1 overflow-y-auto p-6 bg-white">
        <h1 className="text-xl font-bold mb-4">Filtered Task View</h1>

        {filterTask?.length > 0 ? (
          <ul className="space-y-3">
            {filterTask.map((task, index) => (
              <li
                key={task.id || index}
                className="p-4 bg-gray-50 border rounded shadow-sm"
              >
                <p><strong>Title:</strong> {task.tittle}</p>
                <p><strong>Status:</strong> {task.status}</p>
                {/* Add more task details as needed */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tasks found for this filter.</p>
        )}
      </main>
    </div>
  );
};

export default QueryTask;
