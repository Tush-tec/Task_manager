import React, { useEffect } from 'react';
import Sidebar from '../../Component/Sidebar';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';



const UserDashboard = () => {

  const {user} = useAuth()
  const { getTaskWorker, task, updateTask, isLoading, taskListCount  } = useTask()

  useEffect(() => {

    if(user?._id){
      getTaskWorker(user._id)
    }
   
  }, [user]);

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="flex">
      <aside className="w-64">
        < Sidebar/>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">My Tasks</h1>

        <h2 className="text-lg font-bold">Total Task of :{taskListCount}</h2>


        {isLoading ? (
          <p>Loading tasks...</p>
        ) : task?.length === 0 ? (
          <p>No tasks assigned yet.</p>
        ) : (
          <div className="grid gap-4">
            {task?.map((t) => (
              <div key={t._id} >
              <Link to={`${t?._id}`}>

              <div
                key={t._id}
                className="bg-white shadow rounded p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold text-lg">{t.title}</h2>
                  <p className="text-sm text-gray-600">{t.description}</p>
                  <p className="text-sm mt-1">
                    <strong>Due:</strong> {new Date(t.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t._id, e.target.value)}
                    className="border rounded px-2 py-1"
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
              </div>

            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
