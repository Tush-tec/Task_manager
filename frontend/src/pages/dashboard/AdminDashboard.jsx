import React from "react";
import Sidebar from "../../Component/Sidebar";
import TaskDetails from "../tasks/TaskDetails";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900">

      <aside className="w-64 border-r border-gray-700 hidden md:block">
        <Sidebar />
      </aside>


      <main className="flex-1 p-8 overflow-y-auto">
        <TaskDetails />
      </main>
    </div>
  );
};

export default AdminDashboard;
