import React from 'react'
import {Routes, Route, Router} from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import GoogleSuccess from '../pages/Pages'
import Dashboard from '../pages/Dashboard'

const PrivateRoutes = () => {
  return (

    <>

   <Routes>
    <Route path='/dashboard' element = {<Dashboard/>}/>
    <Route path='/' element={<Home/>}/>
    <Route path="/google/success" element={<GoogleSuccess />} />
    <Route path='/register' element={<Register/>}/>
    <Route path='/login' element={<Login/>} />
       
    </Routes>    

    </>

)
}

export default PrivateRoutes