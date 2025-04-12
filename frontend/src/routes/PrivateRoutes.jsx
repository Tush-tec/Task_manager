import React from 'react'
import {Routes, Route, Router} from 'react-router-dom'
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

const PrivateRoutes = () => {
  return (

    <>

   <Routes>
    <Route path='/dashboard' element = {<Dashboard/>}/>
    <Route path='/' element={<Home/>}/>
    <Route path="/google/success" element={<GoogleSuccess />} />
    <Route path='/register' element={<Register/>}/>
    <Route path='/login' element={<Login/>} />
    <Route path = '/create-task' element={<CreateTask/>}/>
    <Route path = '/get-task' element={<TaskDetails/> } />
    <Route  path='/sidebar' element={<Sidebar/>}/>
    <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
    <Route path="/task/:taskId" element={<ViewTask />} />

    <Route path='/user' element={<UserDashboard/>}/>
    <Route path='/user/:taskId' element={<FindTaks/>}/>

        
    </Routes>    

    </>

)
}

export default PrivateRoutes