import React from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./dashboard/AdminDashboard";
import UserDashboard from "./dashboard/UserDashboard";
import SubAdminDashboard from "./dashboard/SubAdminDashboard";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { isAuthenticate, user, loading } = useAuth(); 

  

  if (loading) {
    return <p>Loading...</p>; // or a spinner
  }

  if (!isAuthenticate) {
    return <Navigate to="/login" />;
  }

  if (user?.role === "admin") return <AdminDashboard />;
  if (user?.role === "subAdmin") return <SubAdminDashboard />;
  return <UserDashboard />;
};

export default Home;
