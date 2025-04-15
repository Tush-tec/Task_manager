import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../Component/Sidebar'
import { FaTrash } from 'react-icons/fa';

const RemoveWorker = () => {
    const { fetchWorkers, fetchAndDeleteWorker, workers } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
  
    useEffect(() => {
      fetchWorkers();
    }, []);
  
    const handleDelete = async (id) => {
      await fetchAndDeleteWorker(id);  // ← Clean and uses context
    };
  
    const filteredWorkers = workers?.filter((worker) =>
      worker.role === 'worker' &&
      (worker.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">All Workers</h2>
  
        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full mb-4"
        />
  
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Created At</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers?.map((worker) => (
                <tr key={worker._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{worker.username}</td>
                  <td className="p-2 border">{worker.email}</td>
                  <td className="p-2 border capitalize">{worker.role}</td>
                  <td className="p-2 border">
                    {new Date(worker.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-red-600">
                    <button
                      onClick={() => handleDelete(worker._id)}
                      className="hover:text-red-800"
                      title="Delete Worker"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
  
              {filteredWorkers?.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No matching workers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

export default RemoveWorker