'use client'

import { Task } from './TaskManager'

interface TaskListProps {
  tasks: Task[]
  selectedTask: Task | null
  onSelectTask: (task: Task) => void
  onToggleCompleted: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskList({ 
  tasks, 
  selectedTask, 
  onSelectTask, 
  onToggleCompleted, 
  onDeleteTask 
}: TaskListProps) {
  
  // 优先级颜色映射
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // 优先级文本
  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '高优先级'
      case 'medium': return '中优先级'
      case 'low': return '低优先级'
      default: return '普通'
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '明天'
    if (diffDays === -1) return '昨天'
    if (diffDays > 0) return `${diffDays}天后`
    if (diffDays < 0) return `${Math.abs(diffDays)}天前`

    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
  }

  // 检查是否逾期
  const isOverdue = (task: Task) => {
    return !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <svg
          className="w-16 h-16 mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium mb-2">暂无任务</h3>
        <p className="text-center">点击"新建任务"开始管理您的待办事项</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedTask?.id === task.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
              onClick={() => onSelectTask(task)}
            >
              <div className="flex items-start space-x-3">
                {/* 完成状态复选框 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleCompleted(task.id)
                  }}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {task.completed && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  {/* 任务标题 */}
                  <h3 className={`text-sm font-medium truncate ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </h3>

                  {/* 任务描述 */}
                  {task.description && (
                    <p className={`text-sm mt-1 line-clamp-2 ${
                      task.completed ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {task.description}
                    </p>
                  )}

                  {/* 任务元信息 */}
                  <div className="flex items-center space-x-2 mt-2">
                    {/* 优先级标签 */}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {getPriorityText(task.priority)}
                    </span>

                    {/* 截止日期 */}
                    {task.dueDate && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isOverdue(task)
                          ? 'bg-red-100 text-red-700'
                          : task.completed
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('确定要删除这个任务吗？')) {
                      onDeleteTask(task.id)
                    }
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
