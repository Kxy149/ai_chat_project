# AI 学习助手项目结构

本文档说明 AI 学习助手当前仓库结构、核心源码模块和主要数据流。项目采用 npm workspaces 管理前端和后端两个子项目。

## 项目概览

AI 学习助手是一个基于 Vue 3、TypeScript、Vite、Element Plus、Node.js、Express、MySQL 和 AI API 构建的智能问答平台。

系统主要能力包括：

- 用户登录、注册、注销和 JWT 鉴权
- 演示账号自动初始化
- 多轮 AI 对话和流式回复
- 会话新建、查看、重命名和删除
- Markdown 渲染、代码高亮和代码复制
- 头像地址更新和头像文件上传
- OpenAI / DeepSeek 后端统一代理调用
- MySQL 持久化用户、会话和消息数据

## 技术栈

### 前端

- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router
- Axios
- Markdown 渲染与代码高亮相关库

### 后端

- Node.js
- Express
- TypeScript
- MySQL
- JWT
- bcryptjs
- zod
- multer
- OpenAI SDK
- Server-Sent Events

## 当前目录结构

```text
ai_chat_project/
├── frontend/                         # 前端工作区
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/                 # 聊天页组件
│   │   │   │   ├── ChatInput.vue
│   │   │   │   ├── ConversationSidebar.vue
│   │   │   │   └── MessageList.vue
│   │   │   ├── common/               # 用户资料和通用弹窗组件
│   │   │   │   ├── AvatarDialog.vue
│   │   │   │   ├── PasswordDialog.vue
│   │   │   │   └── UserAvatar.vue
│   │   │   └── markdown/             # Markdown 展示组件
│   │   │       └── MarkdownRenderer.vue
│   │   ├── pages/                    # 页面级组件
│   │   │   ├── ChatPage.vue
│   │   │   └── LoginPage.vue
│   │   ├── router/                   # Vue Router 配置
│   │   │   └── index.ts
│   │   ├── services/                 # 前端 API 封装
│   │   │   ├── authApi.ts
│   │   │   ├── chatApi.ts
│   │   │   ├── conversationApi.ts
│   │   │   └── http.ts
│   │   ├── stores/                   # Pinia 状态管理
│   │   │   ├── authStore.ts
│   │   │   └── chatStore.ts
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── types/
│   │   │   └── chat.ts
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                          # 后端工作区
│   ├── database/
│   │   └── schema.sql                # MySQL 建表脚本
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts                # 环境变量读取与默认值
│   │   ├── controllers/              # HTTP 控制器
│   │   │   ├── auth.controller.ts
│   │   │   ├── chat.controller.ts
│   │   │   └── conversation.controller.ts
│   │   ├── middleware/               # Express 中间件
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── upload.middleware.ts
│   │   ├── routes/                   # API 路由
│   │   │   ├── auth.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   └── conversation.routes.ts
│   │   ├── services/                 # 业务逻辑与第三方 API 封装
│   │   │   ├── ai.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── bootstrap.service.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── conversation.service.ts
│   │   │   ├── deepseek.service.ts
│   │   │   └── openai.service.ts
│   │   ├── storage/                  # MySQL 数据访问层
│   │   │   ├── conversation.storage.ts
│   │   │   ├── db.ts
│   │   │   ├── message.storage.ts
│   │   │   └── user.storage.ts
│   │   ├── types/                    # 后端类型定义
│   │   │   ├── chat.ts
│   │   │   ├── express.d.ts
│   │   │   └── user.ts
│   │   ├── utils/
│   │   │   └── asyncHandler.ts
│   │   └── server.ts                 # Express 应用入口
│   ├── uploads/avatars/              # 头像上传目录，运行时生成文件
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── api.md                        # API 接口文档
│   └── features.md                   # 产品功能说明
├── scripts/                          # 脚本目录，预留扩展
├── .env.example                      # 后端环境变量示例
├── .gitignore
├── package.json                      # 根工作区脚本
├── package-lock.json
├── PROJECT_STRUCTURE.md
└── README.md
```

说明：

- `frontend/dist/` 和 `backend/dist/` 是构建输出目录，不是主要源码目录。
- `node_modules/` 是依赖目录，不纳入项目结构说明。
- `backend/uploads/avatars/` 是头像上传后的运行时文件目录。
- `shared/` 当前未放入实际共享源码，后续如抽取前后端通用类型，可在该目录扩展。

## 前端模块说明

### 页面入口

- `frontend/src/main.ts`：创建 Vue 应用，注册 Pinia、Router 和 Element Plus。
- `frontend/src/App.vue`：应用根组件，承载路由页面。
- `frontend/src/router/index.ts`：配置登录页和聊天页路由，并根据登录状态进行访问控制。

### 页面组件

- `frontend/src/pages/LoginPage.vue`：登录和注册页面，内置演示账号填入入口。
- `frontend/src/pages/ChatPage.vue`：聊天主页面，组合会话侧边栏、消息列表和输入框。

### 聊天组件

- `ChatInput.vue`：用户消息输入、发送、停止生成和重新生成操作。
- `ConversationSidebar.vue`：会话列表、新建会话、重命名、删除、用户头像和退出入口。
- `MessageList.vue`：消息列表展示，负责区分用户消息和 AI 消息。

### 用户与通用组件

- `UserAvatar.vue`：展示当前用户头像或默认头像。
- `AvatarDialog.vue`：头像地址更新和本地头像上传。
- `PasswordDialog.vue`：修改密码弹窗。

### Markdown 组件

- `MarkdownRenderer.vue`：渲染 AI 回复中的 Markdown 内容，并处理代码块高亮和复制。

### 前端服务层

- `http.ts`：Axios 实例和通用请求/响应处理。
- `authApi.ts`：登录、注册、注销、头像和密码相关接口。
- `conversationApi.ts`：会话列表、创建、详情、重命名和删除接口。
- `chatApi.ts`：聊天流式接口和重新生成接口，负责读取 SSE 数据流。

### 前端状态管理

- `authStore.ts`：保存 JWT、当前用户信息和登录状态，读写 `localStorage`。
- `chatStore.ts`：维护会话列表、当前会话、消息列表、AI 生成状态和请求中断控制器。

## 后端模块说明

### 应用入口

`backend/src/server.ts` 负责：

- 创建 Express 应用
- 配置 CORS、JSON 解析和静态上传目录
- 注册健康检查、认证、聊天和会话路由
- 对聊天和会话接口启用 JWT 鉴权
- 注册统一错误处理中间件
- 启动前自动初始化演示管理员账号

### 配置模块

- `config/env.ts`：读取端口、CORS、JWT、AI 供应商、模型和 MySQL 连接配置。

### 路由与控制器

- `routes/auth.routes.ts`：注册、登录、当前用户、修改密码、头像更新、头像上传和注销路由。
- `routes/chat.routes.ts`：流式聊天和重新生成路由。
- `routes/conversation.routes.ts`：会话列表、创建、详情、更新和删除路由。
- `controllers/*.ts`：使用 zod 校验请求参数，调用 service，并返回 HTTP 响应。

### 中间件

- `auth.middleware.ts`：解析 Bearer Token，把用户信息挂到 `req.user`。
- `error.middleware.ts`：统一处理业务错误和参数校验错误。
- `upload.middleware.ts`：处理头像文件上传。

### 业务服务

- `auth.service.ts`：注册、登录、JWT 签发、密码校验、头像更新和密码修改。
- `bootstrap.service.ts`：启动时创建或更新演示管理员账号。
- `conversation.service.ts`：会话列表、创建、详情、重命名和删除业务逻辑。
- `chat.service.ts`：保存用户消息、创建助手消息、组织上下文、处理 SSE 流式返回、重新生成回复和自动生成会话标题。
- `ai.service.ts`：根据环境变量选择 OpenAI 或 DeepSeek 服务。
- `openai.service.ts`：OpenAI 调用封装。
- `deepseek.service.ts`：DeepSeek 调用封装。

### 数据访问层

- `db.ts`：MySQL 连接池。
- `user.storage.ts`：用户查询、创建、头像更新、密码更新和演示账号写入。
- `conversation.storage.ts`：会话查询、创建、重命名、更新时间和软删除。
- `message.storage.ts`：消息创建、查询、更新和删除。

### 类型与工具

- `types/chat.ts`：聊天消息、会话和 AI 消息类型。
- `types/user.ts`：用户和 JWT 用户类型。
- `types/express.d.ts`：扩展 Express Request 类型，使 `req.user` 可用。
- `utils/asyncHandler.ts`：包装异步控制器，将错误交给统一错误处理中间件。

## 主要调用流程

### 登录流程

```text
LoginPage.vue
  ↓
authStore.login()
  ↓
authApi.loginApi()
  ↓
POST /api/auth/login
  ↓
auth.controller.ts
  ↓
auth.service.ts
  ↓
user.storage.ts
  ↓
返回 user + token，前端写入 localStorage
```

### 会话加载流程

```text
ChatPage.vue mounted
  ↓
chatStore.loadConversations()
  ↓
conversationApi.listConversations()
  ↓
GET /api/conversations
  ↓
auth.middleware.ts
  ↓
conversation.controller.ts
  ↓
conversation.service.ts
  ↓
conversation.storage.ts
```

### 流式聊天流程

```text
ChatInput.vue
  ↓
chatStore.sendMessage()
  ↓
chatApi.streamChat()
  ↓
POST /api/chat/stream
  ↓
auth.middleware.ts
  ↓
chat.controller.ts 设置 SSE 响应头
  ↓
chat.service.ts 保存用户消息和助手占位消息
  ↓
ai.service.ts 选择 OpenAI 或 DeepSeek
  ↓
openai.service.ts / deepseek.service.ts
  ↓
SSE token / done / stopped / error 事件返回前端
  ↓
chatStore 追加 token 并刷新当前会话
```

## 数据库结构

建表脚本位于 `backend/database/schema.sql`。

核心表：

- `users`：用户账号、邮箱、密码哈希、头像和状态。
- `conversations`：用户会话、标题、模型、系统提示词、归档状态、软删除时间。
- `messages`：会话消息、角色、内容、模型、token 统计字段、状态和错误信息。

表关系：

```text
users 1 ---- n conversations
conversations 1 ---- n messages
```

常用索引：

```sql
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

## 环境配置

环境变量示例位于 `.env.example`，开发时复制到 `backend/.env`。

关键配置：

- `PORT`：后端服务端口。
- `CORS_ORIGIN`：允许访问后端的前端地址。
- `JWT_SECRET`：JWT 签名密钥。
- `AI_PROVIDER`：当前 AI 供应商，可选 `openai` 或 `deepseek`。
- `OPENAI_API_KEY` / `DEEPSEEK_API_KEY`：供应商 API Key。
- `DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PASSWORD`、`DB_NAME`：MySQL 连接配置。

## 根目录脚本

根目录 `package.json` 提供以下脚本：

```bash
npm run dev
npm run build
npm run typecheck
```

- `npm run dev`：并行启动前端和后端开发服务。
- `npm run build`：构建前端和后端。
- `npm run typecheck`：执行前后端 TypeScript 类型检查。
