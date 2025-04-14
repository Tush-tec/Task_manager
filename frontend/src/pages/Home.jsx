import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./dashboard/AdminDashboard";
import UserDashboard from "./dashboard/UserDashboard";
import SubAdminDaskboard from "./dashboard/SubAdminDaskboard";

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      {user.role === "admin" ? (
        <AdminDashboard />
      ) : user.role === "subAdmin" ? (
        <SubAdminDaskboard />
      ) : (
        <UserDashboard />
      )}
    </>
  );
};

export default Home;
