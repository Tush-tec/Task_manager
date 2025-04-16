import React, { useEffect } from "react";
import { useTask } from "../../context/TaskContext";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { UserIcon } from "lucide-react";
import Sidebar from "../../Component/Sidebar";
import { Link } from "react-router-dom";

const STATUS_KEYS = ["done", "working", "pending", "issue", "in_progress"];
const STATUS_COLORS = {
  done: "#22c55e",
  working: "#3b82f6",
  pending: "#f59e0b",
  issue: "#ef4444",
  in_progress: "#8b5cf6",
};

const ProgressTask = () => {
  const { taskProgressForAdmin, task } = useTask();

  useEffect(() => {
    taskProgressForAdmin();
  }, []);

  const safeTaskArray = Array.isArray(task) ? task : [];


  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-white shadow-md border-r flex-shrink-0">
        <Sidebar />
      </aside>

      <main className="flex-1 overflow-auto bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Worker Task Progress
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeTaskArray.map((worker, index) => {
            const hasTasks = worker.total > 0;
            const chartData = STATUS_KEYS.filter((key) => worker[key] > 0).map(
              (key) => ({
                name: key.replace("_", " "),
                value: worker[key],
                fill: STATUS_COLORS[key],
              })
            );

            return (
              <motion.div
                key={worker.workerId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`rounded-2xl shadow-lg p-5 ${
                  hasTasks ? "bg-white" : "bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <UserIcon
                    className={`w-6 h-6 ${
                      hasTasks ? "text-blue-600" : "text-gray-200"
                    }`}
                  />
                  <div>
                    <h2
                      className={`text-lg font-semibold ${
                        hasTasks ? "text-gray-800" : "text-gray-300"
                      }`}
                    >
                      {worker.email}
                    </h2>
                    <Link to={`/task-progress/task/${worker.workerId}`}>
                      <p
                        className={`text-sm ${
                          hasTasks ? "text-gray-500" : "text-gray-200"
                        }`}
                      >
                        ID: {worker.workerId}
                      </p>
                    </Link>
                  </div>
                </div>

                {hasTasks ? (
                  <>
                    <div className="h-40 mb-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            innerRadius={30}
                            label
                          >
                            {chartData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                      {chartData.map((item) => (
                        <Link
                          key={item.name}
                          to={`/task-progress/task/${
                            worker.workerId
                          }?status=${item.name.replace(" ", "_")}`}
                          className="flex items-center gap-1 hover:underline"
                        >
                          <span
                            className="w-3 h-3 rounded-full inline-block"
                            style={{ backgroundColor: item.fill }}
                          ></span>
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4 text-sm text-gray-700 space-y-1">
                      <p>
                        Total Tasks: <strong>{worker.total}</strong>
                      </p>
                      <p className="text-red-500">
                        Overdue: <strong>{worker.overDue}</strong>
                      </p>
                      <p>
                        Progress: <strong>{worker.progress}%</strong>
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-400 mt-10 text-sm italic">
                    No tasks assigned
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ProgressTask;
