import { Inter } from 'next/font/google';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '工作工具集 - Work Tools',
  description: '一个集成多种实用工具的工作平台',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
