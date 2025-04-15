import React, { useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { UserIcon } from 'lucide-react';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']; // done, working, pending, issue, in_progress

const ProgressTask = () => {
  const { taskProgressForAdmin, task } = useTask();

  useEffect(() => {
    taskProgressForAdmin();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {task.map((worker, index) => {
        const chartData = ['done', 'working', 'pending', 'issue', 'in_progress']
          .filter(key => worker[key] > 0)
          .map((key, idx) => ({
            name: key.replace('_', ' '),
            value: worker[key],
            fill: COLORS[idx]
          }));

        return (
          <motion.div
            key={worker.workerId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <UserIcon className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold">{worker.email}</h2>
                <p className="text-sm text-gray-500">ID: {worker.workerId}</p>
              </div>
            </div>

            <div className="h-40">
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

            <div className="mt-4 text-sm">
              <p>Total Tasks: <strong>{worker.total}</strong></p>
              <p className="text-red-500">Overdue: <strong>{worker.overDue}</strong></p>
              <p className="mt-2">Progress: <strong>{worker.progress}%</strong></p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProgressTask;
