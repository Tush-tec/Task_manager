import React from 'react'
import { useAuth } from '../context/AuthContext'

const Home = () => {

  const {isAuthenticated} = useAuth()



  return (
    <div>Home</div>
  )
}

export default Home