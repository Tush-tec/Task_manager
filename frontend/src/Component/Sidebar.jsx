import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaSignOutAlt,
  FaCog,
  FaPlus,
  FaSearch,
  FaBell,
  FaClock,
  FaStar,
  FaChevronDown,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CreateTask from "../pages/tasks/CreateTask";
import { motion, AnimatePresence } from "framer-motion";
import { useTask } from "../context/TaskContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { task } = useTask();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="w-64 bg-gray-50 h-screen shadow-sm p-4 flex flex-col justify-between">
        <div>
          {user && (
            <div className="flex items-center justify-between mb-6">
              <div
                className="flex items-center gap-2 relative"
                ref={dropdownRef}
              >
                {user?.picture ? (
                  <img
                    src={user?.picture}
                    alt="user"
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                    referrerPolicy="no-referrer"
                    onClick={() => setShowDropdown(!showDropdown)}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-semibold cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {user?.username?.[0]}
                  </div>
                )}
                <p className="text-sm font-medium">{user.username}</p>
                <FaChevronDown
                  className={`text-gray-500 text-xs cursor-pointer transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  onClick={() => setShowDropdown(!showDropdown)}
                />

                {/* Dropdown menu */}
                <div
                  className={`absolute top-10 left-0 w-40 bg-white border shadow-lg rounded-md z-10 overflow-hidden transition-all duration-200 ease-in-out transform origin-top-left ${
                    showDropdown
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-sm"
                  >
                    <FaCog /> Account Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-sm text-red-500"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>

              <button
                className="p-2 hover:bg-gray-200 rounded"
                onClick={() => navigate("/tasks")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4 4h16v2H4zm0 6h16v2H4zm0 6h10v2H4z" />
                </svg>
              </button>
            </div>
          )}

          {/* Icons Row */}
          <div className="flex items-center justify-between mb-4 px-1">
            {/* <button className="p-2 bg-white rounded shadow hover:bg-gray-100">
              <FaClock />
            </button>
            */}
            <button className="p-2 bg-white rounded shadow hover:bg-gray-100">
              <FaSearch />
            </button>

            {user?.role === "admin" ? (
              <button
                className="p-2 bg-white rounded shadow hover:bg-gray-100"
                onClick={() => setShowCreateForm(true)}
              >
                <FaPlus />
              </button>
            ) : (
              <button className="p-2 bg-white rounded shadow hover:bg-gray-100">
                <FaBell />
              </button>
            )}
          </div>

          {/* My Tasks */}
          <div className="text-sm font-medium text-gray-600 mb-2">My Tasks</div>
          <div className="flex flex-col gap-1 text-sm mb-6">
            <button className="flex items-center justify-between px-2 py-2 rounded hover:bg-gray-100">
              <Link to={"/user"}>
                <span className="flex items-center gap-2">✅ My tasks</span>{" "}
              </Link>

              <span className="text-gray-500 text-xs">{task.length}</span>
            </button>
            <button className="flex items-center justify-between px-2 py-2 rounded hover:bg-gray-100">
              <span className="flex items-center gap-2">
                📅 Today
                <span className="ml-2 bg-gray-300 text-white text-xs px-2 rounded-full">
                  12
                </span>
              </span>
              <span className="text-gray-500 text-xs">0</span>
            </button>
          </div>

          {/* Projects */}
          <div
            className="flex items-center justify-between text-sm font-medium text-gray-600 cursor-pointer"
            onClick={() => setShowProjects(!showProjects)}
          >
            <span>Projects</span>
            <div className="flex items-center gap-2">
              <FaStar className="text-gray-400" />
              <FaChevronDown
                className={`transition-transform ${
                  showProjects ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {showProjects && (
            <div className="mt-2 text-gray-400 italic text-sm px-2">
              No projects yet
            </div>
          )}
        </div>
      </div>

      {/* Animate Create Task Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50"
          >
            <div className="">
              <CreateTask onClose={() => setShowCreateForm(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
