import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTask } from "../../context/TaskContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import Sidebar from "../../Component/Sidebar";

const COLORS = ["#7c3aed", "#4ade80", "#fbbf24", "#f97316", "#22d3ee"];
const BARCHARTSCOLORS = [
"#A1B29A", 
  "#F1D0B8",
  "#F6D365",
  "#FF6F61",
  "#B0A0C2"
  ];

const TaskProgress = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { taskProgress, task } = useTask();

  const [viewType, setViewType] = useState("pie");

  useEffect(() => {
    taskProgress(workerId);
  }, [workerId]);

  const data = [
    { name: "Pending", value: task?.pending || 0, key: "pending" },
    { name: "In Progress", value: task?.in_progress || 0, key: "in_progress" },
    { name: "Done", value: task?.done || 0, key: "done" },
    { name: "Overdue", value: task?.overDue || 0, key: "overDue" },
    { name: "Working", value: task?.working || 0, key: "working" },
  ];

  const handleClick = (data) => {
    if (data?.payload?.key) {
      navigate(`/tasks/${workerId}/${data.payload.key}`);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">

      <div className="w-[250px] h-full border-r border-gray-200 bg-white shadow-lg z-20">
          <Sidebar/>

      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">
            Task Progress Overview
          </h1>
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-md transition-all duration-300"
            onClick={() => setViewType(viewType === "pie" ? "bar" : "pie")}
          >
            {viewType === "pie" ? <BarChart3 size={18} /> : <PieChartIcon size={18} />}
            <span className="text-sm font-medium">
              Switch to {viewType === "pie" ? "Bar" : "Pie"} Chart
            </span>
          </button>
        </motion.div>

        {/* Chart Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white relative rounded-2xl shadow-2xl p-8 mb-12 border border-gray-100 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

          <div className="mb-6 flex items-center gap-3 z-10 relative">
            <PieChartIcon className="text-indigo-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
              Visual Task Distribution
            </h2>
          </div>

          <div className="w-full h-[320px] z-10 relative">
            {viewType === "pie" ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    innerRadius={60}
                    paddingAngle={5}
                    onClick={handleClick}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        cursor="pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
                <ResponsiveContainer>
                <BarChart data={data} onClick={handleClick} barCategoryGap="20%">
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={BARCHARTSCOLORS[index % COLORS.length]} cursor="pointer" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              
            )}
          </div>
        </motion.div>

        {/* Status Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-20"
        >
          {data.map((status) => (
            <motion.div
              key={status.key}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(`/tasks/${workerId}/${status.key}`)}
            >
              <h2 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                {status.name}
              </h2>
              <p className="text-4xl font-extrabold text-gray-900">
                {status.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TaskProgress;
