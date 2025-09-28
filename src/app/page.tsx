'use client';

import { useState, useEffect } from 'react';
import NoteEditor from '@/components/NoteEditor';
import NotesList from '@/components/NotesList';
import { TaskManager } from '@/components/TaskManager';
import { DatabaseManager } from '@/components/DatabaseManager';
import { GlobalSearch } from '@/components/GlobalSearch';
import { AuthTest } from '@/components/AuthTest';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// 自定义 SVG 图标组件
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NotesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TaskIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DatabaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 12C21 13.66 16.97 15 12 15S3 13.66 3 12" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 5V19C3 20.66 7.03 22 12 22S21 20.66 21 19V5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAuthTest, setShowAuthTest] = useState(false);

  // 笔记管理函数
  const createNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      id: Date.now().toString(),
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setIsEditing(false);
  };

  const updateNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedNoteId) return;
    
    setNotes(prev => prev.map(note => 
      note.id === selectedNoteId 
        ? { ...note, ...noteData, updatedAt: new Date() }
        : note
    ));
    setIsEditing(false);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNoteId === noteId) {
      setSelectedNoteId(undefined);
    }
  };

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  // 处理搜索导航
  const handleSearchNavigate = (type: string, id: string) => {
    if (type === 'note') {
      setActiveTab('notes');
      setSelectedNoteId(id);
    } else if (type === 'task') {
      setActiveTab('tasks');
    } else if (type === 'database' || type === 'record') {
      setActiveTab('database');
    }
  };

  // 键盘快捷键
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  };

  // 绑定键盘事件
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">WorkSpace</h1>
              </div>
            </div>

            {/* 搜索栏 */}
            <div className="flex-1 max-w-lg mx-8">
              <div 
                className="relative cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <div className="block w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg leading-5 bg-white text-gray-500 hover:bg-gray-50 transition-colors">
                  搜索笔记、任务、数据库...
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <kbd className="inline-flex items-center px-2 py-1 text-xs font-mono text-gray-400 bg-gray-100 border border-gray-200 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* 用户头像 */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowAuthTest(true)}
                className="px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                title="测试 Firebase 认证"
              >
                🔥 测试认证
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <PlusIcon />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* 侧边栏 */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'home' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">🏠</span>
                </div>
                <span className="font-medium">工作台</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'notes' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <NotesIcon />
                <span className="font-medium">笔记</span>
              </button>

              <button
                onClick={() => setActiveTab('tasks')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'tasks' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <TaskIcon />
                <span className="font-medium">任务</span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'database' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <DatabaseIcon />
                <span className="font-medium">数据库</span>
              </button>
            </nav>
          </div>

          {/* 快捷模板 */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-3">快速开始</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                📝 会议记录
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                📊 项目管理
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                📅 日程规划
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                💡 知识库
              </button>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 overflow-auto">
          {activeTab === 'home' && (
            <div className="p-8">
              {/* 欢迎区域 */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  欢迎回来！👋
                </h2>
                <p className="text-gray-600">
                  让我们开始高效的工作吧。这里是你的数字工作空间。
                </p>
              </div>

              {/* 快速操作卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <NotesIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">创建笔记</h3>
                  <p className="text-gray-600 text-sm">
                    记录想法、整理思路，支持富文本编辑和多媒体内容
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <TaskIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">任务管理</h3>
                  <p className="text-gray-600 text-sm">
                    制定计划、跟踪进度，让每个任务都有条不紊
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <DatabaseIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">数据管理</h3>
                  <p className="text-gray-600 text-sm">
                    结构化存储信息，像表格一样简单易用
                  </p>
                </div>
              </div>

              {/* 最近使用 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">最近使用</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📄</span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">开始你的第一个项目</h4>
                    <p className="text-gray-600 mb-4">
                      创建笔记、任务或数据库，开始高效的工作流程
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      开始创建
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="flex h-full">
              {/* 笔记列表 */}
              <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">我的笔记</h2>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索笔记..."
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <SearchIcon />
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                  <NotesList
                    notes={notes}
                    selectedNoteId={selectedNoteId}
                    onSelectNote={setSelectedNoteId}
                    onDeleteNote={deleteNote}
                  />
                </div>
              </div>

              {/* 笔记内容/编辑器 */}
              <div className="flex-1">
                {isEditing ? (
                  <NoteEditor
                    note={selectedNote}
                    onSave={selectedNote ? updateNote : createNote}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : selectedNote ? (
                  <div className="h-full flex flex-col bg-white">
                    {/* 查看模式头部 */}
                    <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                      <h1 className="text-xl font-semibold text-gray-900">
                        {selectedNote.title}
                      </h1>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        编辑
                      </button>
                    </div>
                    
                    {/* 内容显示 */}
                    <div className="flex-1 p-4 overflow-auto">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                          {selectedNote.content}
                        </pre>
                      </div>
                    </div>
                    
                    {/* 底部信息 */}
                    <div className="border-t border-gray-200 px-4 py-2 text-sm text-gray-500 flex items-center justify-between">
                      <div>创建于 {selectedNote.createdAt.toLocaleString('zh-CN')}</div>
                      <div>更新于 {selectedNote.updatedAt.toLocaleString('zh-CN')}</div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-white">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <NotesIcon />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">选择一个笔记</h3>
                      <p className="text-gray-600 mb-4">从左侧列表选择一个笔记开始阅读</p>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        创建新笔记
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <TaskManager />
          )}

          {activeTab === 'database' && (
            <DatabaseManager />
          )}
        </main>
      </div>

      {/* 全局搜索 */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleSearchNavigate}
      />

      {/* Firebase 认证测试 */}
      {showAuthTest && (
        <AuthTest onClose={() => setShowAuthTest(false)} />
      )}
    </div>
  );
}