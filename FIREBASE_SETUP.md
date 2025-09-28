# 🔥 Firebase 配置完整指南

## 📋 配置步骤

### 1️⃣ 创建 Firebase 项目

1. **访问 Firebase 控制台**
   - 打开 https://console.firebase.google.com/
   - 用 Google 账号登录

2. **创建新项目**
   - 点击「添加项目」
   - 项目名称：`work-tools`
   - 启用 Google Analytics（推荐）
   - 点击「创建项目」

### 2️⃣ 启用 Authentication

1. **进入 Authentication**
   - 左侧菜单 → Authentication
   - 点击「Get started」

2. **配置登录方式**
   - 点击「Sign-in method」标签
   - 启用以下方式：
     - ✅ **Email/Password**
     - ✅ **Google** (可选)

### 3️⃣ 添加 Web 应用

1. **注册应用**
   - 项目概览 → 点击 Web 图标 `</>`
   - 应用昵称：`work-tools-web`
   - 点击「注册应用」

2. **复制配置**
   - 复制显示的 `firebaseConfig` 对象

### 4️⃣ 配置项目

1. **创建环境变量文件**
   ```bash
   # 在项目根目录创建 .env.local 文件
   touch .env.local
   ```

2. **填入配置信息**
   ```env
   # 将从 Firebase 控制台复制的配置填入
   NEXT_PUBLIC_FIREBASE_API_KEY=你的-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=你的项目.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=你的项目id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=你的项目.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=你的sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=你的app-id
   ```

3. **更新 Firebase 配置文件**
   - 打开 `config/firebase.js`
   - 确认配置正确

### 5️⃣ 启动项目

```bash
# 安装依赖（如果还没安装）
npm install

# 启动开发服务器
npm run dev
```

### 6️⃣ 测试认证功能

访问以下页面测试：
- http://localhost:3000/register - 注册新用户
- http://localhost:3000/login - 用户登录
- http://localhost:3000/test-firebase - 测试 Firebase 连接

## 🔧 配置示例

### Firebase 控制台配置示例
```javascript
// 从 Firebase 控制台复制的配置
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "work-tools-12345.firebaseapp.com",
  projectId: "work-tools-12345",
  storageBucket: "work-tools-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

### .env.local 文件示例
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=work-tools-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=work-tools-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=work-tools-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

## 🚨 重要提醒

1. **安全性**
   - ✅ `.env.local` 文件已在 `.gitignore` 中，不会被提交
   - ✅ 使用 `NEXT_PUBLIC_` 前缀的环境变量才能在客户端使用
   - ⚠️ 不要将真实的 API Key 提交到代码仓库

2. **测试步骤**
   - ✅ 先测试 Firebase 连接是否正常
   - ✅ 再测试用户注册功能
   - ✅ 最后测试登录和登出功能

3. **常见问题**
   - 如果出现 "Firebase: No Firebase App" 错误，检查配置是否正确
   - 如果注册失败，确认 Authentication 已启用
   - 如果域名错误，检查 authDomain 配置

## 📞 需要帮助？

如果配置过程中遇到问题，请：
1. 检查 Firebase 控制台的配置
2. 确认环境变量文件格式正确
3. 查看浏览器控制台的错误信息
4. 重启开发服务器

配置完成后，你就可以使用完整的用户认证功能了！🎉
