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
import SubAdminManager from '../pages/SubAdmin/SubAdminManager'
import RemoveTask from '../pages/tasks/RemoveTask'
import RemoveWorker from '../pages/RemoveWorker'
import ProgressTask from '../pages/tasks/ProgressTask'
import TaskProgress from '../pages/tasks/TaskProgress'

const PrivateRoutes = () => {
  return (

    <>

   <Routes>

    <Route path='/register' element={<Register/>}/>
    <Route path='/dashboard' element = {<Dashboard/>}/>
    <Route path='/' element={<Home/>}/>
    <Route path="/google/success" element={<GoogleSuccess />} />
    <Route path='/login' element={<Login/>} />
    <Route path = '/create-task' element={<CreateTask/>}/>
    <Route path = '/get-task' element={<TaskDetails/> } />
    <Route  path='/sidebar' element={<Sidebar/>}/>
    <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
    <Route path="/task/:taskId" element={<ViewTask />} />

    <Route path='/user' element={<UserDashboard/>}/>
    <Route path='/user/:taskId' element={<FindTaks/>}/>

    <Route path='/subadmin-manager' element={<SubAdminManager/>}/>

    <Route path='/remove-task'  element={<RemoveTask/>}/>
    <Route path='/remove-worker'  element={<RemoveWorker/>}/>
    <Route path='/task-progress' element={<ProgressTask/>}/>
    
    <Route path= '/task-progress/task/:workerId' element={<TaskProgress/>}/>

        
    </Routes>    

    </>

)
}

export default PrivateRoutes