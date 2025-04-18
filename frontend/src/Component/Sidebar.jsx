import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaCog,
  FaPlus,
  FaSearch,
  FaBell,
  FaStar,
  FaChevronDown,
  FaUserAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";
import { useSubAdmin } from "../context/SubAdminContext";
import CreateTask from "../pages/tasks/CreateTask";

import RemoveTask from "../pages/tasks/RemoveTask";
import { Loader } from "lucide-react";

const Sidebar = () => {
  const { user, isAuthenticate, ready, logout } = useAuth();

  const { task } = useTask();


  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [ShowDeleteForm, setShowDeleteForm] =   useState(false)
  const [showUserManager, setShowUserManager] = useState(false);
  const [showTaskManager, setTaskManager] = useState(false )
  const [searchQuery, setIsSearchQuery]  = useState("")
  const [searchQueryResult, setIsSearchQueryResult]  = useState([]) 
  

  const dropdownRef = useRef(null);
  const navigate = useNavigate();


 

  useEffect(()=>{
    
    if(searchQuery.trim() === "") {
      setIsSearchQueryResult([])
      return
    }

    const makeLowerQuery = searchQuery.trim().toLowerCase()

    const queryResult = task?.filter(
      (t) => {
        t.name.toLowerCase().includes(makeLowerQuery)
      }
    )
  }, [searchQuery, task])


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  const handleLogout = () => {
   logout()
    navigate("/login");
  };

  if (!ready) return <Loader/>
  if (!isAuthenticate) return navigate("/login")

  return (
    <>
      <div className="w-64 bg-gray-50 h-screen shadow-sm p-4 flex flex-col justify-between">

        <div>
          {user && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                {user.picture ? (
                  <img
                    src={user.picture}
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
                    {user.username?.[0]}
                  </div>
                )}
                <p className="text-sm font-medium">{user.username}</p>
                <FaChevronDown
                  className={`text-gray-500 text-xs cursor-pointer transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  onClick={() => setShowDropdown(!showDropdown)}
                />

                <div
                  className={`absolute top-10 left-0 w-40 bg-white border shadow-lg rounded-md z-10 overflow-hidden transition-all duration-200 transform origin-top-left ${
                    showDropdown ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
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
              <button className="p-2 hover:bg-gray-200 rounded" onClick={() => navigate("/tasks")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h16v2H4zm0 6h16v2H4zm0 6h10v2H4z" />
                </svg>
              </button>
            </div>
          
          )}


          <div className="flex items-center justify-between mb-4 px-1">
            <button className="p-2 bg-white rounded shadow hover:bg-gray-100"
            >
              <FaSearch />
            </button>
            <button className="p-2 bg-white rounded shadow hover:bg-gray-100"
            >
              <FaBell />
            </button>
            <button className="p-2 bg-white rounded shadow hover:bg-gray-100"
            >
              <FaUserAlt />
            </button>
            {user?.role === "admin" ||  user.role === "subAdmin" ?(
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


            {user.role !== "admin" || "subAdmin" ?(
              <>
              
              </>
            ) : (
          <>
          
          <div
            className="flex items-center justify-between text-sm font-medium text-gray-600 cursor-pointer"
            onClick={() => setShowProjects(!showProjects)}
          >
            <span>Projects</span>
            <div className="flex items-center gap-2">
              <FaStar className="text-gray-400" />
              <FaChevronDown className={`transition-transform ${showProjects ? "rotate-180" : ""}`} />
            </div>
          </div>
          {showProjects && (
            <div className="mt-2 text-gray-400 italic text-sm px-2">No projects yet</div>
          )}

          
          </>
          

            )
            

            }

          
          {/* Manage Users (Admin Only) */}
          {user?.role === "admin" && (
            <div className="mt-6">
              <div
                className="text-sm font-medium text-gray-600 mb-2 cursor-pointer flex justify-between items-center"
                onClick={() => setShowUserManager(!showUserManager)}
              >
                <span>Manage Worker</span>
                <FaChevronDown
                  className={`transition-transform duration-200 ${showUserManager ? "rotate-180" : ""}`}
                />
              </div>

              {showUserManager && (
                <div className="ml-4 flex flex-col gap-2 text-sm text-gray-700">
                                      <button
                    className="text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => navigate("/register")}>
                    Register worker
                  </button>
                    <button
                    className="text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => navigate("/remove-worker")}>
                      Remove worker
                  </button>
                  <button
                    onClick={() => navigate("/subadmin-manager")}
                    className="text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Manage Worker
                  </button >
                    <button
                    className="text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => navigate("/reporting-analysis")}>
                    Reporting & Analytics
                  </button>  
                    <button
                    className="text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => navigate("/task-status")}>
                  </button>  

                  
                  
                </div>
              )}
            </div>
          )}

          <hr />
          {user?.role === "admin" && (
            <div className="mt-6">
              <div
                className="text-sm font-medium text-gray-600 mb-2 cursor-pointer flex justify-between items-center"
                onClick={() => setTaskManager(!showTaskManager)}
              >
                <span>Manage Task</span>
                <FaChevronDown
                  className={`transition-transform duration-200 ${showTaskManager ? "rotate-180" : ""}`}
                />
              </div>

              {showTaskManager && (
                <div className="ml-4 flex flex-col gap-2 text-sm text-gray-700">
                                      <button
                    className="text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => setShowCreateForm(true)}>
                    create Task
                  </button>
                    <button
                    className="text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => {setShowDeleteForm(true)

                      navigate("/remove-task")
                    }}>
                      Remove Task 
                  </button>
                  <button
                    onClick={() => navigate(`/task-progress`)}
                    className="text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
                   Task Progress
                  </button >
                    <button
                    className="text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => navigate("/task-status")}>
                    Task Stats
                  </button>  
                    <button
                    className="text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => navigate("/task-status")}>
                  </button>  

                  {/*  */}
                  
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center"
          >
            <CreateTask onClose={() => setShowCreateForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ShowDeleteForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center"
          >
            <RemoveTask onClose={() => setShowDeleteForm(false)} />
          </motion.div>
        )}
      </AnimatePresence> 

      {/* {/* Add Delete  form here  */}
    </>
  );
};

export default Sidebar;
