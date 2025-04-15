import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
  const { register, error } = useAuth();

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'worker', // default role
  });

  const handleInputField = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    await register(registerData);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/v1/user/auth/google';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100  px-4">
      <div className="bg-gray-900  p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Create an Account</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submitRegistration} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={registerData.username}
              onChange={handleInputField}
              required
              className="w-full border text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleInputField}
              required
              className="w-full border border-gray-300 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleInputField}
              required
              className="w-full border border-gray-300 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Role</label>
            <select
              name="role"
              value={registerData.role}
              onChange={handleInputField}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="worker">Worker</option>
              <option value="subAdmin">SubAdmin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all"
          >
            Register
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-300 w-full" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="h-px bg-gray-300 w-full" />
        </div>

        {/* <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-70 transition-all"
        >
          <FcGoogle size={20} />
          <span className="text-sm font-medium text-white text-gray-700">Continue with Google</span>
        </button> */}
      </div>
    </div>
  );
};

export default Register;
