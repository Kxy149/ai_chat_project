# AI 学习助手

AI 学习助手是一个面向学习场景的智能问答与会话管理平台。用户登录后可以创建学习会话、连续提问、查看历史记录，并通过 Markdown 和代码高亮获得更适合阅读的 AI 回复。

项目采用前后端分离架构：前端负责页面交互和流式展示，后端统一代理 OpenAI / DeepSeek 等 AI API，并将用户、会话和消息数据保存到 MySQL。

## 核心功能

- 用户登录、注册、注销和登录状态保持
- 演示账号自动创建，方便快速体验
- 多轮 AI 对话和上下文会话管理
- AI 回复流式输出、停止生成、重新生成
- 会话列表查看、新建、重命名、删除
- Markdown 渲染、代码高亮和代码复制
- 用户头像上传、默认头像和头像地址更新
- OpenAI / DeepSeek 后端统一代理调用
- MySQL 持久化保存用户、会话和消息记录

## 技术栈

前端：

- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router

后端：

- Node.js
- Express
- TypeScript
- MySQL
- JWT
- OpenAI SDK
- Server-Sent Events 流式响应

## 演示账号

后端启动时会自动创建演示管理员账号：

```text
账号：admin
密码：123456
```

登录页默认填入该账号，也可以点击“填入”恢复演示账号信息。

## 快速启动

1. 安装依赖：

```bash
npm install
```

2. 配置环境变量：

```text
复制 .env.example 为 backend/.env
```

然后填写 MySQL 连接信息、JWT 密钥和至少一个 AI 供应商的 API Key。

3. 初始化数据库：

```text
backend/database/schema.sql
```

4. 启动开发服务：

```bash
npm run dev
```

前端默认地址：

```text
http://localhost:5173
```

后端默认地址：

```text
http://localhost:3000
```

## 常用脚本

```bash
npm run dev
npm run build
npm run typecheck
```

## 环境变量

主要配置项位于 `.env.example`：

```text
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=change_me_to_a_long_random_secret

AI_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4.1-mini

DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ai_learning_assistant
```

`AI_PROVIDER` 可设置为 `openai` 或 `deepseek`。前端不会直接访问 AI API，所有模型请求都由后端转发，避免 API Key 暴露在浏览器中。

## 使用流程

1. 打开前端地址进入登录页。
2. 使用演示账号登录，或注册新账号。
3. 在聊天页新建会话或选择已有会话。
4. 输入学习问题，等待 AI 流式回复。
5. 根据需要停止生成、重新生成、重命名会话或删除会话。
6. 在头像入口上传头像或更新个人头像。

## 文档

- 功能说明：[docs/features.md](docs/features.md)
- API 接口文档：[docs/api.md](docs/api.md)
- 项目结构说明：[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

## 数据库

项目使用 MySQL 保存核心数据。建表 SQL 位于：

```text
backend/database/schema.sql
```

核心表包括：

- `users`：用户账号、邮箱、密码哈希和头像
- `conversations`：会话标题、所属用户、模型和会话状态
- `messages`：用户消息、AI 回复、模型信息和生成状态
