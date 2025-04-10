import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <img
              src={user?.picture}
              alt="User"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-xl font-semibold">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-blue-500 capitalize">{user?.role || "user"}</p>
            </div>
          </div>

          {/* Stats Placeholder */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">5</p>
                <p className="text-gray-600 text-sm">Tasks Assigned</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">2</p>
                <p className="text-gray-600 text-sm">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">1</p>
                <p className="text-gray-600 text-sm">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">2</p>
                <p className="text-gray-600 text-sm">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder for recent activity or notifications */}
        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="text-gray-700 list-disc list-inside space-y-2">
            <li>You completed the task “Update project docs.”</li>
            <li>Admin assigned a new task to you.</li>
            <li>Your account role was updated to Subadmin.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
