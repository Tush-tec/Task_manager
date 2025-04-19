import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import GoogleSuccess from '../pages/Pages'
import Dashboard from '../pages/Dashboard'
import CreateTask from '../pages/tasks/CreateTask'
import TaskDetails from '../pages/tasks/TaskDetails'
import Sidebar from '../Component/Sidebar'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import ViewTask from '../pages/tasks/ViewTask'
import UserDashboard from '../pages/dashboard/UserDashboard'
import FindTaks from '../pages/tasks/FindTaks'
import SubAdminManager from '../pages/SubAdmin/SubAdminManager'
import RemoveTask from '../pages/tasks/RemoveTask'
import RemoveWorker from '../pages/RemoveWorker'
import ProgressTask from '../pages/tasks/ProgressTask'
import TaskProgress from '../pages/tasks/TaskProgress'
import QueryTask from '../pages/tasks/QueryTask'
import ProtectedRoute from './ProtectedRoute'
const PrivateRoutes = () => {
  return (
    <Routes>
\      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/google/success" element={<GoogleSuccess />} />


      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/create-task" element={
        <ProtectedRoute><CreateTask /></ProtectedRoute>
      } />
      <Route path="/get-task" element={
        <ProtectedRoute><TaskDetails /></ProtectedRoute>
      } />
      <Route path="/sidebar" element={
        <ProtectedRoute><Sidebar /></ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/my-task/task/:taskId" element={
        <ProtectedRoute><ViewTask /></ProtectedRoute>
      } />
      <Route path="/my-tasks" element={
        <ProtectedRoute><UserDashboard /></ProtectedRoute>
      } />
      <Route path="/task/:taskId" element={
        <ProtectedRoute><FindTaks /></ProtectedRoute>
      } />
      <Route path="/subadmin-manager" element={
        <ProtectedRoute><SubAdminManager /></ProtectedRoute>
      } />
      <Route path="/remove-task" element={
        <ProtectedRoute><RemoveTask /></ProtectedRoute>
      } />
      <Route path="/remove-worker" element={
        <ProtectedRoute><RemoveWorker /></ProtectedRoute>
      } />
      <Route path="/task-progress" element={
        <ProtectedRoute><ProgressTask /></ProtectedRoute>
      } />
      <Route path="/task-progress/task/:workerId" element={
        <ProtectedRoute><TaskProgress /></ProtectedRoute>
      } />
      <Route path="/task-progress/task-filter/:workerId" element={
        <ProtectedRoute><QueryTask /></ProtectedRoute>
      } />
    </Routes>
  );
};

export default PrivateRoutes;
