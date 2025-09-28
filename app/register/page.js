'use client';

import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import RegisterForm from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  // 如果用户已登录，重定向到首页
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // 如果用户已登录，不显示注册表单
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 页面头部 */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            {/* 注册图标 SVG */}
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            创建新账户
          </h1>
          <p className="text-gray-600">
            注册账户开始您的工具之旅
          </p>
        </div>

        {/* 注册表单卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <RegisterForm />
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
