import React, { useEffect } from 'react'
import { useSubAdmin } from '../../context/SubAdminContext'

const TaskUpdate = () => {

    const {setSubAdmin, error, isLoading} = useSubAdmin()
    

    useEffect(() => {
        setSubAdmin(workerId)
    },[])



  return (
    <>
    
    <div>
    <select >

        <option value=""></option>
    </select>
    </div>
    

    </>
  )
}

export default TaskUpdate