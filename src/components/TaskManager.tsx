'use client';

import { useState } from 'react';

export function TaskManager() {
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">任务管理</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 p-2 border rounded-l-lg"
          placeholder="添加新任务"
        />
        <button onClick={addTask} className="px-4 py-2 bg-blue-600 text-white rounded-r-lg">
          添加
        </button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id} onClick={() => toggleTask(task.id)} className={`p-2 rounded-lg cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
