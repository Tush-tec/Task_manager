// imports
import React, { useEffect, useState } from "react";
import { LockClosedIcon, ArrowRightCircleIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../context/AuthContext";

import { FcGoogle } from "react-icons/fc"; // Google Icon
import Input from "../Component/Input";
import Button from "../Component/Button";
import { useNavigate } from "react-router-dom";



const Login = () => {
  const [userLogin, setUserLogin] = useState({ username: "", email: "", password: "" });
  const { login, error } = useAuth();
  const navigate = useNavigate()


  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserLogin((prev) => ({ ...prev, [name]: value }));
  };

  const { isAuthenticate } = useAuth()

  useEffect(() => {
    if (isAuthenticate) {
      navigate('/')
    }
  }, [isAuthenticate])

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    await login(userLogin);
  };

  const handleGoogleLogin = () => {
    window.open(`${import.meta.env.VITE_BACKEND_URL}/user/auth/google`, "_self");
  };
  

  return (
    <div className="flex justify-center items-center flex-col min-h-screen p-4 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">We Welcome You!</h1>
      <div className="w-full max-w-md p-8 flex flex-col gap-5 bg-gray-800 shadow-md rounded-2xl border border-secondary">
        <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
          <LockClosedIcon className="h-8 w-8 mb-2" /> Login
        </h1>

        <form onSubmit={handleOnSubmit} className="flex flex-col gap-4 w-full">
          <Input
            placeholder="Enter your username..."
            name="username"
            value={userLogin.username}
            autoComplete="username"
            onChange={handleOnChange}
          />
          <Input 
          type="email"
          name="email"
          placeholder="Enter your email...."
          value={userLogin.email}
          autoComplete="email"
          onChange={handleOnChange}

          />

          <Input
            placeholder="Enter your password..."
            name="password"
            type="password"
            value={userLogin.password}
            autoComplete="current-password"
            onChange={handleOnChange}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
           className="bg-white p-2 m-2 border-white rounded" type="submit" disabled={!userLogin.username || !userLogin.password}>
            Login
          </Button>
        </form>

        <div className="flex items-center my-3">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex justify-center items-center gap-2 text-black bg-white hover:bg-gray-100 transition rounded-xl py-2 w-full font-semibold shadow"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <small className="text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <a className="text-blue-500 hover:underline" href="/register">
            Register
          </a>
        </small>
      </div>
    </div>
  );
};

export default Login;
