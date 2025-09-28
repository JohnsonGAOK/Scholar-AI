'use client';

import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  // 如果用户已登录，重定向到首页
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // 如果用户已登录，不显示登录表单
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 页面头部 */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            {/* 登录图标 SVG */}
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            欢迎回来
          </h1>
          <p className="text-gray-600">
            登录您的账户以继续使用
          </p>
        </div>

        {/* 登录表单卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoginForm />
        </div>

        {/* 返回首页链接 */}
        <div className="text-center mt-6">
          <a 
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
