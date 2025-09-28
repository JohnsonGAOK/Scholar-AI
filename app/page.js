'use client';

import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

export default function HomePage() {
  const { user, loading } = useAuth();

  // 渲染加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {user ? (
          // 已登录用户的主界面
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              欢迎回来, {user.displayName || '学者'}
            </h1>
            <p className="text-lg text-gray-600 mb-8">准备好开始您的学术创作之旅了吗？</p>
            
            {/* 写作编辑器区域 - 占位符 */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <textarea
                className="w-full h-96 p-4 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                placeholder="在此处开始撰写您的论文，或将您的想法输入，让 AI 帮助您润色..."
              ></textarea>
              <div className="mt-4 flex justify-end">
                <button className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 transition-colors">
                  智能润色
                </button>
              </div>
            </div>
          </div>
        ) : (
          // 未登录用户的欢迎页
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              欢迎使用 <span className="text-gray-800">Scholar AI</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              您的智能学术伙伴，让中文学术写作更高效、更专业、更轻松。
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a
                  href="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  免费注册
                </a>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                  href="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-800 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  登录账户
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
