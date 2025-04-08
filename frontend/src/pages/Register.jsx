import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Register = () => {

    const {register, error,} = useAuth()

    const [registerData, setRegisterData] = useState(
        {
            username: "",
            email : "",
            password : "",

        }
    )

    const handleInputField = (e) => {
        const {name, value} = e.target


        setRegisterData(
            (prevDetails) => ({
                ...prevDetails,
                [name] : value

            })
        )
    }

    const submitRegistration = async (e) =>{
        e.preventDefault()
        console.log("data is submit");
        
        await register(registerData)
    }



  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

      <form className="flex flex-col space-y-4" onSubmit={submitRegistration}>
        {error && <div className="bg-red-500 p-3 text-white rounded">{error}</div>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border p-2 rounded"
          value={registerData.username}
          onChange={handleInputField}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={registerData.email}
          onChange={handleInputField}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={registerData.password}
          onChange={handleInputField}
          required
        />

        <button
          type="submit"
          className="bg-black text-white py-5 rounded-xl hover:bg-gray-800 transition"
        >
            submit
        </button>
      </form>
      </div>
  )
}

export default Register