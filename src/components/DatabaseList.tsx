'use client'

import { useState } from 'react'
import { Database } from './DatabaseManager'

interface DatabaseListProps {
  databases: Database[]
  selectedDatabase: Database | null
  onSelectDatabase: (database: Database) => void
  onDeleteDatabase: (databaseId: string) => void
  isCreating: boolean
  onCreateDatabase: (name: string, description?: string) => void
  onCancelCreate: () => void
}

export function DatabaseList({
  databases,
  selectedDatabase,
  onSelectDatabase,
  onDeleteDatabase,
  isCreating,
  onCreateDatabase,
  onCancelCreate
}: DatabaseListProps) {
  const [newDatabaseName, setNewDatabaseName] = useState('')
  const [newDatabaseDescription, setNewDatabaseDescription] = useState('')

  const handleCreate = () => {
    if (!newDatabaseName.trim()) return
    
    onCreateDatabase(newDatabaseName, newDatabaseDescription)
    setNewDatabaseName('')
    setNewDatabaseDescription('')
  }

  const handleCancel = () => {
    setNewDatabaseName('')
    setNewDatabaseDescription('')
    onCancelCreate()
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '昨天'
    if (diffDays < 7) return `${diffDays}天前`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`
    return `${Math.floor(diffDays / 365)}年前`
  }

  return (
    <div className="flex flex-col h-full">
      {/* 新建数据库表单 */}
      {isCreating && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="数据库名称"
              value={newDatabaseName}
              onChange={(e) => setNewDatabaseName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              autoFocus
            />
            <textarea
              placeholder="描述（可选）"
              value={newDatabaseDescription}
              onChange={(e) => setNewDatabaseDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleCreate}
                disabled={!newDatabaseName.trim()}
                className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                创建
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 数据库列表 */}
      <div className="flex-1 overflow-y-auto">
        {databases.length === 0 && !isCreating ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <svg
              className="w-12 h-12 mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
            <h3 className="text-sm font-medium mb-1">暂无数据库</h3>
            <p className="text-xs text-center">点击"新建数据库"开始创建您的第一个数据库</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {databases.map((database) => (
              <div
                key={database.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedDatabase?.id === database.id ? 'bg-purple-50 border-r-2 border-purple-500' : ''
                }`}
                onClick={() => onSelectDatabase(database)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {database.name}
                    </h3>
                    {database.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {database.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{database.records.length} 条记录</span>
                      <span>{database.fields.length} 个字段</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      更新于 {formatDate(database.updatedAt)}
                    </div>
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`确定要删除数据库"${database.name}"吗？此操作不可恢复。`)) {
                        onDeleteDatabase(database.id)
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-2"
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
        )}
      </div>
    </div>
  )
}
