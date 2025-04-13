import React, { useEffect, useState } from 'react';
import { useSubAdmin } from '../../context/SubAdminContext';
import Sidebar from '../../Component/Sidebar';
import { motion } from 'framer-motion';

const SubAdminManager = () => {
  const { getManageWorker, manageWorker, setSubAdmin } = useSubAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getManageWorker();
  }, []);

  const handleRoleChange = (workerId) => {
    setSubAdmin(workerId);
  };

  const filteredWorkers = manageWorker?.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-slate-100 to-blue-50">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-white shadow-xl border-r fixed md:relative z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 md:ml-0 md:pl-72 md:pr-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Manage Workers & SubAdmins
          </h1>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full p-3 border border-gray-300 rounded-2xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Worker Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkers?.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-slate-100 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.picture || `https://ui-avatars.com/api/?name=${user.username}`}
                  alt={user.username}
                  className="w-14 h-14 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{user.username}</h3>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <span
                  className={`px-4 py-1 text-xs rounded-full font-medium capitalize ${
                    user.role === 'subAdmin'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {user.role}
                </span>

                <select
                  value={user.role}
                  onChange={() => handleRoleChange(user._id)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="worker">Worker</option>
                  <option value="subAdmin">SubAdmin</option>
                </select>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredWorkers?.length === 0 && (
          <p className="text-center text-gray-500 mt-16 text-lg">No users found.</p>
        )}
      </main>
    </div>
  );
};

export default SubAdminManager;
