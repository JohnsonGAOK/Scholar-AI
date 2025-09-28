'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 如果用户未登录，不显示内容
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            个人资料
          </h1>
          <p className="text-gray-600">
            管理您的账户信息和设置
          </p>
        </div>

        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* 用户头像和基本信息 */}
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mr-6">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="用户头像"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {user.displayName || '未设置用户名'}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.emailVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.emailVerified ? '✓ 邮箱已验证' : '⚠ 邮箱未验证'}
                </span>
              </div>
            </div>
          </div>

          {/* 账户详细信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">用户 ID</h3>
              <p className="text-gray-900 font-mono text-sm break-all">{user.uid}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">创建时间</h3>
              <p className="text-gray-900">
                {new Date(user.metadata.creationTime).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">最后登录</h3>
              <p className="text-gray-900">
                {new Date(user.metadata.lastSignInTime).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">登录方式</h3>
              <p className="text-gray-900">
                {user.providerData.map(provider => {
                  const providerNames = {
                    'password': '邮箱密码',
                    'google.com': 'Google',
                    'facebook.com': 'Facebook'
                  };
                  return providerNames[provider.providerId] || provider.providerId;
                }).join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                登出中...
              </div>
            ) : (
              '安全登出'
            )}
          </button>
          
          <a 
            href="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium text-center"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
