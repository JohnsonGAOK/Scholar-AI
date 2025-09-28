'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, getErrorMessage } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('请填写所有字段');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      router.push('/'); // 登录成功后跳转到首页
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 错误提示 */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 邮箱输入 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            邮箱地址
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="请输入邮箱地址"
          />
        </div>

        {/* 密码输入 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            密码
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="请输入密码"
          />
        </div>

        {/* 登录按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              登录中...
            </div>
          ) : (
            '登录'
          )}
        </button>

        {/* 分割线 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">或</span>
          </div>
        </div>

        {/* 注册链接 */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            还没有账户？{' '}
            <a href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
              立即注册
            </a>
          </p>
        </div>

        {/* 忘记密码链接 */}
        <div className="text-center">
          <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
            忘记密码？
          </a>
        </div>
      </form>
    </div>
  );
}
