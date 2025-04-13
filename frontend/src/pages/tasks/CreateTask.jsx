import React, { useEffect, useState } from "react";
import { useTask } from "../../context/TaskContext";
import Input from "../../Component/Input";
import Loader from "../../Component/Loader";
import Button from "../../Component/Button";
import { useAuth } from "../../context/AuthContext";
import { FaTimes } from "react-icons/fa";
import Select from "react-select";

const CreateTask = ({ onClose }) => {
  const { createTask, error, isLoading } = useTask();
  const { fetchWorkers, workers } = useAuth();

  const [taskForm, setTaskForm] = useState({
    tittle: "",
    description: "",
    assignedTo: [],
    dueDate: "",
  });

  const handleChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask(taskForm);
    setTaskForm({
      tittle: "",
      description: "",
      assignedTo: [],
      dueDate: "",
    });
    onClose(); // close after successful creation
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  return (
    <div className="max-w-xl w-full mx-auto bg-gray-50 rounded-2xl shadow-2xl p-6 relative z-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">Create New Task</h2>
        <button
          className="text-gray-500 hover:text-red-500 transition"
          onClick={onClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="tittle"
          placeholder="Task title"
          value={taskForm.tittle}
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

        <Select
          isMulti
          name="assignedTo"
          options={workers?.map((worker) => ({
            value: worker._id,
            label: worker.name || worker.email,
          }))}
          value={workers
            ?.filter((worker) => taskForm.assignedTo.includes(worker._id))
            .map((worker) => ({
              value: worker._id,
              label: worker.name || worker.email,
            }))}
          onChange={(selectedOptions) => {
            setTaskForm({
              ...taskForm,
              assignedTo: selectedOptions.map((opt) => opt.value),
            });
          }}
          className="basic-multi-select"
          classNamePrefix="select"
        />

        <Input
          type="date"
          name="dueDate"
          value={taskForm.dueDate}
          onChange={handleChange}
          className="w-full"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-400 transition duration-300"
            onClick={onClose}
          >
            <FaTimes /> Cancel
          </button>

          <Button
            type="submit"
            className="bg-blue-600  text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Create Task"}
          </Button>
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default CreateTask;
