'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { useEffect } from 'react';

interface AuthTestProps {
  onClose: () => void;
}

export const AuthTest = ({ onClose }: AuthTestProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setMessage(`✅ 认证成功！用户：${user.email}`);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('✅ 登录成功！');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('✅ 注册成功！');
      }
    } catch (error: any) {
      console.error('认证错误:', error);
      setMessage(`❌ 错误：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMessage('✅ 已退出登录');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setMessage(`❌ 退出失败：${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-96 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            🔥 Firebase 认证测试
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {user ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800">✅ 认证成功！</h3>
              <p className="text-green-700">用户：{user.email}</p>
              <p className="text-green-700">UID：{user.uid}</p>
            </div>
            
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              退出登录
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  isLogin 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                登录
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !isLogin 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                注册
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入你的邮箱"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入密码（至少6位）"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </button>
          </form>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          <p>💡 测试提示：</p>
          <p>• 注册新账号或使用已有账号登录</p>
          <p>• 密码至少需要6位字符</p>
          <p>• 成功后会显示用户信息</p>
        </div>
      </div>
    </div>
  );
};
