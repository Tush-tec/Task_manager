import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../Component/Sidebar';
import { FaTrash } from 'react-icons/fa';

const RemoveWorker = () => {
  const { fetchWorkers, fetchAndDeleteWorker, workers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleDelete = async (id) => {
    await fetchAndDeleteWorker(id);
  };

  const filteredWorkers = workers?.filter(
    (worker) =>
      (worker.role === "worker" || worker.role === "subAdmin") &&
      (worker.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      <aside className="w-64 bg-white shadow-md border-r border-gray-200">
        <Sidebar />
      </aside>


      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Workers</h1>

          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="overflow-auto bg-white shadow rounded-xl">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-blue-50 text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 border-b">Username</th>
                  <th className="px-4 py-3 border-b">Email</th>
                  <th className="px-4 py-3 border-b">Role</th>
                  <th className="px-4 py-3 border-b">Created At</th>
                  <th className="px-4 py-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers?.map((worker) => (
                  <tr key={worker._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">{worker.username}</td>
                    <td className="px-4 py-3 border-b">{worker.email}</td>
                    <td className="px-4 py-3 border-b capitalize">{worker.role}</td>
                    <td className="px-4 py-3 border-b">
                      {new Date(worker.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border-b text-center">
                      <button
                        onClick={() => handleDelete(worker._id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-150"
                        title="Delete Worker"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredWorkers?.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-400">
                      No matching workers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RemoveWorker;
