'use client'

import { useState } from 'react'
import { Database, DatabaseField, DatabaseRecord } from './DatabaseManager'

interface DatabaseTableProps {
  database: Database
  onUpdateDatabase: (updates: Partial<Database>) => void
  onAddField: (field: Omit<DatabaseField, 'id'>) => void
  onUpdateField: (fieldId: string, updates: Partial<DatabaseField>) => void
  onDeleteField: (fieldId: string) => void
  onAddRecord: (data: { [fieldId: string]: any }) => void
  onUpdateRecord: (recordId: string, data: { [fieldId: string]: any }) => void
  onDeleteRecord: (recordId: string) => void
}

export function DatabaseTable({
  database,
  onUpdateDatabase,
  onAddField,
  onUpdateField,
  onDeleteField,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord
}: DatabaseTableProps) {
  const [isAddingField, setIsAddingField] = useState(false)
  const [isAddingRecord, setIsAddingRecord] = useState(false)
  const [editingRecord, setEditingRecord] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [newFieldData, setNewFieldData] = useState({
    name: '',
    type: 'text' as DatabaseField['type'],
    required: false,
    options: [] as string[]
  })

  // 字段类型选项
  const fieldTypes = [
    { value: 'text', label: '文本' },
    { value: 'number', label: '数字' },
    { value: 'date', label: '日期' },
    { value: 'select', label: '选择' },
    { value: 'checkbox', label: '复选框' }
  ]

  // 添加字段
  const handleAddField = () => {
    if (!newFieldData.name.trim()) return

    onAddField({
      name: newFieldData.name,
      type: newFieldData.type,
      required: newFieldData.required,
      options: newFieldData.type === 'select' ? newFieldData.options : undefined
    })

    setNewFieldData({
      name: '',
      type: 'text',
      required: false,
      options: []
    })
    setIsAddingField(false)
  }

  // 添加记录
  const handleAddRecord = () => {
    const data: { [fieldId: string]: any } = {}
    database.fields.forEach(field => {
      const input = document.querySelector(`[data-field="${field.id}"]`) as HTMLInputElement
      if (input) {
        let value = input.value
        if (field.type === 'number') value = parseFloat(value) || 0
        if (field.type === 'checkbox') value = input.checked
        if (field.type === 'date' && value) value = new Date(value).toISOString()
        data[field.id] = value
      }
    })

    onAddRecord(data)
    setIsAddingRecord(false)
  }

  // 更新记录
  const handleUpdateRecord = (recordId: string) => {
    const data: { [fieldId: string]: any } = {}
    database.fields.forEach(field => {
      const input = document.querySelector(`[data-record="${recordId}"][data-field="${field.id}"]`) as HTMLInputElement
      if (input) {
        let value = input.value
        if (field.type === 'number') value = parseFloat(value) || 0
        if (field.type === 'checkbox') value = input.checked
        if (field.type === 'date' && value) value = new Date(value).toISOString()
        data[field.id] = value
      }
    })

    onUpdateRecord(recordId, data)
    setEditingRecord(null)
  }

  // 渲染字段输入
  const renderFieldInput = (field: DatabaseField, value: any, recordId?: string, isEditing = false) => {
    const baseProps = {
      'data-field': field.id,
      'data-record': recordId,
      className: `w-full px-2 py-1 text-sm ${isEditing ? 'border border-gray-300 rounded' : 'border-none bg-transparent'} focus:outline-none focus:ring-1 focus:ring-purple-500`,
      disabled: !isEditing && recordId !== undefined
    }

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            defaultValue={value || ''}
            placeholder={field.name}
            {...baseProps}
          />
        )
      case 'number':
        return (
          <input
            type="number"
            defaultValue={value || ''}
            placeholder={field.name}
            {...baseProps}
          />
        )
      case 'date':
        const dateValue = value ? new Date(value).toISOString().split('T')[0] : ''
        return (
          <input
            type="date"
            defaultValue={dateValue}
            {...baseProps}
          />
        )
      case 'select':
        return (
          <select
            defaultValue={value || ''}
            {...baseProps}
          >
            <option value="">选择...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case 'checkbox':
        return (
          <input
            type="checkbox"
            defaultChecked={value || false}
            {...baseProps}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
        )
      default:
        return null
    }
  }

  // 格式化显示值
  const formatDisplayValue = (field: DatabaseField, value: any) => {
    if (value === null || value === undefined || value === '') return '-'
    
    switch (field.type) {
      case 'date':
        return new Date(value).toLocaleDateString('zh-CN')
      case 'checkbox':
        return value ? '✓' : '✗'
      default:
        return String(value)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 数据库头部 */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">{database.name}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAddingField(true)}
              className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-md hover:bg-purple-200 transition-colors"
            >
              添加字段
            </button>
            <button
              onClick={() => setIsAddingRecord(true)}
              disabled={database.fields.length === 0}
              className="text-sm bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              添加记录
            </button>
          </div>
        </div>
        {database.description && (
          <p className="text-sm text-gray-600">{database.description}</p>
        )}
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          <span>{database.records.length} 条记录</span>
          <span>{database.fields.length} 个字段</span>
          <span>更新于 {new Date(database.updatedAt).toLocaleString('zh-CN')}</span>
        </div>
      </div>

      {/* 表格内容 */}
      <div className="flex-1 overflow-auto">
        {database.fields.length === 0 ? (
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
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2">添加字段开始使用</h3>
            <p className="text-center mb-4">为您的数据库添加字段，然后就可以开始添加数据了</p>
            <button
              onClick={() => setIsAddingField(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              添加第一个字段
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                {database.fields.map((field) => (
                  <th
                    key={field.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span>{field.name}</span>
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                        <div className="text-xs text-gray-400 normal-case mt-1">
                          {fieldTypes.find(t => t.value === field.type)?.label}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`确定要删除字段"${field.name}"吗？`)) {
                            onDeleteField(field.id)
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
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
                  </th>
                ))}
                <th className="px-4 py-3 w-20"></th>
              </tr>
              
              {/* 添加字段行 */}
              {isAddingField && (
                <tr className="bg-blue-50">
                  <td colSpan={database.fields.length + 1} className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="字段名称"
                        value={newFieldData.name}
                        onChange={(e) => setNewFieldData(prev => ({ ...prev, name: e.target.value }))}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                      />
                      <select
                        value={newFieldData.type}
                        onChange={(e) => setNewFieldData(prev => ({ ...prev, type: e.target.value as DatabaseField['type'] }))}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                      >
                        {fieldTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={newFieldData.required}
                          onChange={(e) => setNewFieldData(prev => ({ ...prev, required: e.target.checked }))}
                          className="mr-1"
                        />
                        必填
                      </label>
                      <button
                        onClick={handleAddField}
                        disabled={!newFieldData.name.trim()}
                        className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                      >
                        添加
                      </button>
                      <button
                        onClick={() => setIsAddingField(false)}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        取消
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {/* 添加记录行 */}
              {isAddingRecord && (
                <tr className="bg-green-50">
                  {database.fields.map((field) => (
                    <td key={field.id} className="px-4 py-2">
                      {renderFieldInput(field, '', undefined, true)}
                    </td>
                  ))}
                  <td className="px-4 py-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={handleAddRecord}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setIsAddingRecord(false)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              
              {/* 数据记录 */}
              {database.records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {database.fields.map((field) => (
                    <td key={field.id} className="px-4 py-2">
                      {editingRecord === record.id ? (
                        renderFieldInput(field, record.data[field.id], record.id, true)
                      ) : (
                        <span className="text-sm text-gray-900">
                          {formatDisplayValue(field, record.data[field.id])}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-2">
                    <div className="flex space-x-1">
                      {editingRecord === record.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateRecord(record.id)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setEditingRecord(null)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingRecord(record.id)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('确定要删除这条记录吗？')) {
                                onDeleteRecord(record.id)
                              }
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {database.records.length === 0 && !isAddingRecord && (
                <tr>
                  <td colSpan={database.fields.length + 1} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-8 h-8 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>暂无数据</span>
                      <button
                        onClick={() => setIsAddingRecord(true)}
                        className="mt-2 text-purple-600 hover:text-purple-800 text-sm"
                      >
                        添加第一条记录
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
