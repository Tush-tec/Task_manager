import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./dashboard/AdminDashboard";

import UserDashboard from "./dashboard/UserDashboard";
import SubAdminDashboard from "./dashboard/SubAdminDashboard";

const Home = () => {
  const { isAuthenticate, user } = useAuth();

  return (
    <div className="">
      {isAuthenticate ? (
         <>
         {user.role === "admin" ? (
           <AdminDashboard />
         ) : user.role === "subAdmin" ? (
           <SubAdminDashboard />
         ) : (
           <UserDashboard />
         )}
       </>
        
      ) : (
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Where do you want to go?
          </h2>
          <div className="space-y-4">
            <Link
              to="/register"
              className="block w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-full transition duration-300"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full transition duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
