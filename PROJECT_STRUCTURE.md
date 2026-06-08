# AI 学习助手项目结构

## 项目简介

AI 学习助手是一个基于 Vue 3、TypeScript、Vite、Element Plus、Node.js、Express、MySQL 和 AI API 构建的智能问答平台。

AI 能力通过后端统一调用，支持接入：

- OpenAI API
- DeepSeek API

项目支持以下核心功能：

- 多轮对话
- 聊天记录管理
- Markdown 渲染
- 代码高亮
- AI 回复流式输出
- 会话创建、重命名、删除和查看

## 技术栈

### 前端

- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router
- Markdown 渲染库
- 代码高亮库

### 后端

- Node.js
- Express
- TypeScript
- OpenAI SDK
- MySQL
- Server-Sent Events 或流式响应
- OpenAI API 或 DeepSeek API

## 项目主目录

```text
Ai-chat-project/
├── frontend/                  # 前端项目：Vue 3 + TypeScript + Vite + Element Plus
│   ├── public/                # 静态资源，会被 Vite 直接托管
│   ├── src/
│   │   ├── assets/            # 图片、图标、静态前端资源
│   │   ├── components/        # 可复用 UI 组件，主要基于 Element Plus 封装
│   │   │   ├── chat/          # 聊天相关组件
│   │   │   ├── markdown/      # Markdown 渲染和代码块组件
│   │   │   └── common/        # 通用组件，如按钮、弹窗、加载状态、空状态
│   │   ├── composables/       # Vue 组合式函数
│   │   ├── layouts/           # 页面布局组件
│   │   ├── pages/             # 页面级组件
│   │   ├── router/            # Vue Router 路由配置
│   │   ├── services/          # 前端接口请求封装
│   │   ├── stores/            # Pinia 状态管理
│   │   ├── styles/            # 全局样式、主题变量
│   │   ├── types/             # 前端 TypeScript 类型定义
│   │   ├── utils/             # 前端工具函数
│   │   ├── App.vue            # 根组件
│   │   └── main.ts            # 前端入口文件
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                   # 后端项目：Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/            # 环境变量和应用配置
│   │   ├── controllers/       # 控制器，处理请求和响应
│   │   ├── middleware/        # 中间件，如错误处理、参数校验、鉴权
│   │   ├── routes/            # API 路由定义
│   │   ├── services/          # 业务服务，如 AI API、聊天、流式响应
│   │   ├── storage/           # 数据存储层，负责 MySQL 数据访问
│   │   ├── types/             # 后端 TypeScript 类型定义
│   │   ├── utils/             # 后端工具函数
│   │   └── server.ts          # Express 服务入口
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                    # 前后端共享类型、常量
│   ├── types/
│   └── constants/
│
├── docs/                      # 项目文档
│   ├── api.md                 # API 接口文档
│   └── features.md            # 功能说明文档
│
├── scripts/                   # 开发、构建、部署脚本
├── .env.example               # 环境变量示例
├── .gitignore
├── package.json               # 根目录工作区配置，可选
└── README.md
```

## 前端模块说明

### `components/chat`

聊天核心组件目录，建议包含：

- `ChatLayout.vue`：聊天主布局
- `ConversationSidebar.vue`：会话侧边栏
- `MessageList.vue`：消息列表
- `MessageItem.vue`：单条消息
- `ChatInput.vue`：消息输入框
- `ConversationActions.vue`：会话操作按钮，如新建、重命名、删除

### `components/markdown`

Markdown 和代码展示组件目录，建议包含：

- `MarkdownRenderer.vue`：Markdown 渲染组件
- `CodeBlock.vue`：代码块展示组件
- `CopyCodeButton.vue`：复制代码按钮

### `components/common`

通用组件目录，建议基于 Element Plus 做轻量封装：

- 通用按钮
- 弹窗
- 加载状态
- 空状态
- 错误提示

### `services`

前端接口请求目录，建议包含：

- `chatApi.ts`：聊天接口，包括发送消息、接收流式响应
- `conversationApi.ts`：会话接口，包括查询、新建、重命名、删除

### `stores`

Pinia 状态管理目录，建议包含：

- `chatStore.ts`：当前会话、消息列表、AI 生成状态
- `conversationStore.ts`：会话列表、当前选中会话
- `sessionStore.ts`：用户偏好设置，如模型、主题、输入参数

## 后端模块说明

### `routes`

API 路由目录，建议包含：

- `chat.routes.ts`：聊天和流式回复接口
- `conversation.routes.ts`：会话管理接口

### `controllers`

控制器目录，负责接收请求、调用 service、返回响应。

建议包含：

- `chat.controller.ts`
- `conversation.controller.ts`

### `services`

业务逻辑目录，建议包含：

- `openai.service.ts`：OpenAI API 调用封装
- `deepseek.service.ts`：DeepSeek API 调用封装
- `ai.service.ts`：AI 服务统一入口，根据配置选择 OpenAI 或 DeepSeek
- `chat.service.ts`：聊天上下文、多轮对话处理
- `stream.service.ts`：流式输出处理
- `conversation.service.ts`：会话管理业务逻辑

### `storage`

数据存储层目录。

推荐使用 MySQL 存储用户、会话和消息数据。

建议包含：

- `db.ts`：MySQL 连接池配置
- `user.storage.ts`
- `conversation.storage.ts`
- `message.storage.ts`

### `middleware`

Express 中间件目录，建议包含：

- `error.middleware.ts`：统一错误处理
- `validate.middleware.ts`：请求参数校验
- `auth.middleware.ts`：鉴权预留

## AI 接口调用流程

前端不直接调用 OpenAI API 或 DeepSeek API，所有 AI 请求都必须通过 Node.js 后端转发。

整体流程：

```text
前端页面
  ↓
Node.js + Express 服务器
  ↓
OpenAI API 或 DeepSeek API
  ↓
Node.js + Express 服务器
  ↓
前端页面展示结果
```

这样设计的原因：

- 保护 API Key，避免密钥暴露在浏览器中。
- 统一处理模型参数、上下文、聊天记录和用户权限。
- 方便在 OpenAI API 和 DeepSeek API 之间切换。
- 后端可以统一处理错误、限流、日志和 token 统计。

### AI 服务设计

后端建议使用统一的 `ai.service.ts` 作为 AI 调用入口。

```text
chat.controller.ts
  ↓
chat.service.ts
  ↓
ai.service.ts
  ├── openai.service.ts
  └── deepseek.service.ts
```

推荐通过环境变量控制当前使用的 AI 供应商：

```text
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini

DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_MODEL=deepseek-chat
```

当 `AI_PROVIDER=openai` 时，后端调用 OpenAI API。

当 `AI_PROVIDER=deepseek` 时，后端调用 DeepSeek API。

## 核心 API 设计

```text
POST   /api/chat/stream              # 发送消息并流式返回 AI 回复
GET    /api/conversations            # 获取会话列表
POST   /api/conversations            # 创建会话
GET    /api/conversations/:id        # 获取单个会话及其消息
PATCH  /api/conversations/:id        # 更新会话，如重命名
DELETE /api/conversations/:id        # 删除会话
```

## 数据库设计

推荐数据库：MySQL。

核心表：

- `users`：用户表
- `conversations`：会话表
- `messages`：消息表

### 表关系

```text
users 1 ---- n conversations
conversations 1 ---- n messages
```

一个用户可以拥有多个会话，一个会话可以包含多条消息。

### `users` 用户表

用于存储用户基础信息。

```sql
CREATE TABLE users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  avatar_url VARCHAR(500),
  status TINYINT NOT NULL DEFAULT 1 COMMENT '1=正常, 0=禁用',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

字段说明：

- `id`：用户 ID。
- `username`：用户名。
- `email`：邮箱，可用于登录或找回账号。
- `password_hash`：密码哈希值，预留账号体系使用。
- `avatar_url`：用户头像地址。
- `status`：用户状态。
- `created_at`：创建时间。
- `updated_at`：更新时间。

### `conversations` 会话表

用于存储用户创建的聊天会话。

```sql
CREATE TABLE conversations (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL DEFAULT '新的会话',
  model VARCHAR(100) NOT NULL DEFAULT 'gpt-4.1-mini',
  system_prompt TEXT,
  is_archived TINYINT NOT NULL DEFAULT 0 COMMENT '1=已归档, 0=未归档',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_conversations_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);
```

字段说明：

- `id`：会话 ID。
- `user_id`：所属用户 ID。
- `title`：会话标题。
- `model`：当前会话使用的 AI 模型。
- `system_prompt`：会话级系统提示词。
- `is_archived`：是否归档。
- `created_at`：创建时间。
- `updated_at`：更新时间。
- `deleted_at`：软删除时间。

### `messages` 消息表

用于存储每个会话中的用户消息和 AI 回复。

```sql
CREATE TABLE messages (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  conversation_id BIGINT UNSIGNED NOT NULL,
  role ENUM('system', 'user', 'assistant') NOT NULL,
  content MEDIUMTEXT NOT NULL,
  model VARCHAR(100),
  prompt_tokens INT UNSIGNED DEFAULT 0,
  completion_tokens INT UNSIGNED DEFAULT 0,
  total_tokens INT UNSIGNED DEFAULT 0,
  status ENUM('streaming', 'completed', 'failed') NOT NULL DEFAULT 'completed',
  error_message TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_conversation_id
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    ON DELETE CASCADE
);
```

字段说明：

- `id`：消息 ID。
- `conversation_id`：所属会话 ID。
- `role`：消息角色，包含 `system`、`user`、`assistant`。
- `content`：消息内容，支持 Markdown 文本。
- `model`：生成该消息时使用的模型，主要用于 AI 回复。
- `prompt_tokens`：提示词 token 数。
- `completion_tokens`：回复 token 数。
- `total_tokens`：总 token 数。
- `status`：消息状态。
- `error_message`：AI 回复失败时的错误信息。
- `created_at`：创建时间。
- `updated_at`：更新时间。

### 推荐索引

```sql
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

## 推荐开发顺序

1. 初始化根目录工作区和 `.env.example`。
2. 初始化 `frontend`，安装 Vue 3、TypeScript、Vite、Element Plus、Pinia、Vue Router。
3. 初始化 `backend`，安装 Node.js、Express、TypeScript、OpenAI SDK、MySQL 驱动。
4. 创建 MySQL 数据库和核心表。
5. 先实现普通非流式聊天接口。
6. 再实现 AI 回复流式输出。
7. 增加聊天记录存储。
8. 增加 Markdown 渲染和代码高亮。
9. 完善会话管理：新建、重命名、删除、历史查看。
10. 优化用户体验：加载状态、错误提示、停止生成、复制代码、重新生成。
