import React, { useEffect } from 'react'
import { useTask } from '../../context/TaskContext'

const RemoveTask = () => {1
    const {getTask, task} = useTask()

    useEffect(() => {
        getTask()
    },[])

    console.log(task);
    
  return (
    <div>RemoveTask</div>
  )
}

export default RemoveTask