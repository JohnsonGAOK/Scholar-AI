'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// 创建认证上下文
const AuthContext = createContext();

// 自定义 Hook 用于使用认证上下文
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 认证提供者组件
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 监听用户认证状态变化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // 清理监听器
    return unsubscribe;
  }, []);

  // 用户注册
  const signup = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // 更新用户显示名称
      if (displayName) {
        await updateProfile(result.user, {
          displayName: displayName
        });
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  // 用户登录
  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  // 用户登出
  const logout = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // 重置密码
  const resetPassword = async (email) => {
    try {
      return await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // 获取错误信息的中文翻译
  const getErrorMessage = (error) => {
    const errorMessages = {
      'auth/user-not-found': '用户不存在',
      'auth/wrong-password': '密码错误',
      'auth/email-already-in-use': '邮箱已被使用',
      'auth/weak-password': '密码强度太弱，请使用至少6位字符',
      'auth/invalid-email': '邮箱格式不正确',
      'auth/too-many-requests': '请求过于频繁，请稍后再试',
      'auth/network-request-failed': '网络连接失败',
      'auth/invalid-credential': '登录凭证无效'
    };

    return errorMessages[error.code] || error.message || '发生未知错误';
  };

  // 提供给子组件的值
  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    getErrorMessage
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
