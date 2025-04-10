import React from 'react'
import Register from './pages/Register'
import { Link } from 'react-router-dom'
import Login from './pages/Login'
import PrivateRoutes from './routes/PrivateRoutes'
import Home from './pages/Home'

const App = () => {
  return (
    <>
    
<PrivateRoutes/>    

    </>
    
  )
}

export default App