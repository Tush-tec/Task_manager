import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'


const Login = () => {

    const {login, error} = useAuth()

    const [loginData, setLoginData] = useState({
        username: "",
        email : "",
        password :""
    })

    const handleInputField = (e) => {
        const {name, value} = e.target
        setLoginData((prev) => ({ ...prev, [name]: value }));



    }

    const handleOnSubmit = async (e) =>{
        e.preventDefault()

        await login(loginData)
    }

  return (
    <>
    {error && <div style={{color: 'red'}}>{error}</div>}
    <form onSubmit={handleOnSubmit}>
    <input 
    type="text" 
    placeholder='username'
    name ="username"
    value={loginData.username}
    onChange={handleInputField}

    />

    <input type="email" 
    placeholder='email'
    name='email'
    value={loginData.email}
    onChange={handleInputField}

    />
    <input type="password" 
    placeholder='password'
    name="password"
    value={loginData.password}
    onChange={handleInputField}

    />
     <button type="submit" className='p-2 m-2  text-white rounded  border bg-gray-700' >
        submit
    </button>

    </form>

   
   
    </>
  )
}

export default Login