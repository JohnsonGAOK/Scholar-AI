'use client'

import { useState, useEffect } from 'react'
import { Task } from './TaskManager'

interface TaskEditorProps {
  task: Task | null
  isCreating: boolean
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export function TaskEditor({ task, isCreating, onSave, onCancel }: TaskEditorProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [dueDate, setDueDate] = useState('')
  const [completed, setCompleted] = useState(false)

  // 当选中任务变化时，更新表单数据
  useEffect(() => {
    if (task && !isCreating) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '')
      setCompleted(task.completed)
    } else if (isCreating) {
      // 重置表单为新建状态
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      setCompleted(false)
    }
  }, [task, isCreating])

  // 处理保存
  const handleSave = () => {
    if (!title.trim()) {
      alert('请输入任务标题')
      return
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate + 'T23:59:59').toISOString() : undefined,
      completed,
    }

    onSave(taskData)
  }

  // 处理键盘快捷键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    }
  }

  // 格式化日期显示
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  if (!task && !isCreating) {
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <h3 className="text-lg font-medium mb-2">选择任务进行编辑</h3>
        <p className="text-center">从左侧任务列表中选择一个任务来查看或编辑详情</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">
          {isCreating ? '新建任务' : '编辑任务'}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>

      {/* 表单内容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 任务标题 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            任务标题 *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入任务标题..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>

        {/* 任务描述 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            任务描述
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="详细描述这个任务..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* 优先级 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            优先级
          </label>
          <div className="flex space-x-2">
            {[
              { value: 'low', label: '低优先级', color: 'bg-green-100 text-green-800 border-green-200' },
              { value: 'medium', label: '中优先级', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
              { value: 'high', label: '高优先级', color: 'bg-red-100 text-red-800 border-red-200' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPriority(option.value as Task['priority'])}
                className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                  priority === option.value
                    ? option.color
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 截止日期 */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            截止日期
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {dueDate && (
            <p className="mt-1 text-sm text-gray-600">
              截止时间: {formatDisplayDate(dueDate + 'T23:59:59')}
            </p>
          )}
        </div>

        {/* 完成状态 */}
        {!isCreating && (
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">标记为已完成</span>
            </label>
          </div>
        )}

        {/* 任务信息 */}
        {task && !isCreating && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">任务信息</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">创建时间:</span>{' '}
                {new Date(task.createdAt).toLocaleString('zh-CN')}
              </div>
              <div>
                <span className="font-medium">最后更新:</span>{' '}
                {new Date(task.updatedAt).toLocaleString('zh-CN')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 快捷键提示 */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          快捷键: ⌘+Enter 保存 | Esc 取消
        </p>
      </div>
    </div>
  )
}
