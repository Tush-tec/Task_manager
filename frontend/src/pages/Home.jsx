import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticate } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-200 px-4">
      {isAuthenticate ? (
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome Home 🎉</h1>
          <p className="text-gray-600 mb-6">You are successfully logged in.</p>
          <Link
            to="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-300"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/admin-dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-300"
          >

            Admin dashbord
          </Link>


          <div>
            
              <Link to='/create-task'>
             <div>
              <button className="p-2 m-2  rounded bg-green-200     text-black" >
                Create Task
              </button>
             </div>
              </Link>
            
          </div>
          <div>
            
              <Link to='/get-task'>
             <div>
              <button className="p-2 m-2  rounded bg-gray-200     text-black" >
                getTask
              </button>
             </div>
              </Link>
            
          </div>
        </div>
        
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
