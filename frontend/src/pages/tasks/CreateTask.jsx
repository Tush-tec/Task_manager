import React, { useState } from 'react'
import { useTask } from '../../context/TaskContext'
import Input from '../../Component/Input'
import Loader from '../../Component/Loader'


const CreateTask = () => {
  const { createTask, error, isLoading } = useTask()

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
  })

  const handleChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createTask(taskForm)
    console.log("button is clicked")
    
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">Create New Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="title"
          placeholder="Task Title"
          value={taskForm.title}
          onChange={handleChange}
          className="w-full"
        />

        <textarea
          name="description"
          value={taskForm.description}
          onChange={handleChange}
          placeholder="Task Description"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />

        <Input
          type="text"
          name="assignedTo"
          placeholder="Assigned Worker ID"
          value={taskForm.assignedTo}
          onChange={handleChange}
          className="w-full"
        />

        <Input
          type="date"
          name="dueDate"
          value={taskForm.dueDate}
          onChange={handleChange}
          className="w-full"
        />

        <button
          type="submit"
          className="w-full flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? <Loader/>
          : 'Create Task'}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  )
}

export default CreateTask
