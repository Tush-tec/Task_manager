import React from 'react'
import Register from './pages/Register'
import { Link, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'

const App = () => {
  return (
    <>
    <div className="text-red">hello
      <div className="text-xl  text-center text-red-900    ">
       <Register/>
      </div>
    </div>


    <div>
      <button className='px-2 py-3 m-5 bg-gray-500 border rounded'>
        <Link to="/login" className="text-white">Login</Link>
      </button>
    </div>

    <Routes>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    

    </>
    
  )
}

export default App