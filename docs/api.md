# API 接口文档

本文档说明 AI 学习助手后端当前提供的主要 HTTP API。默认后端地址为：

```text
http://localhost:3000
```

## 通用规则

### 请求格式

除头像上传接口外，请求体默认使用 JSON：

```text
Content-Type: application/json
```

头像上传接口使用：

```text
Content-Type: multipart/form-data
```

### 鉴权方式

除注册、登录和健康检查接口外，业务接口需要携带 JWT：

```text
Authorization: Bearer <token>
```

Token 由登录或注册接口返回。

### 通用错误响应

接口出错时通常返回 JSON：

```json
{
  "message": "错误信息"
}
```

参数校验失败、账号密码错误、会话不存在、AI 调用失败等场景都会使用类似结构。

## 数据结构

### 用户对象

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "avatarUrl": "/uploads/avatars/example.png"
}
```

### 认证响应

```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "avatarUrl": null
  },
  "token": "jwt-token"
}
```

### 会话对象

```json
{
  "id": 1,
  "title": "Vue 响应式",
  "model": "gpt-4.1-mini",
  "updatedAt": "2026-06-08T05:30:00.000Z"
}
```

### 消息对象

```json
{
  "id": 1,
  "conversationId": 1,
  "role": "user",
  "content": "请解释 Vue3 的 ref 和 reactive",
  "status": "completed",
  "createdAt": "2026-06-08T05:30:00.000Z"
}
```

`role` 可选值：

- `system`
- `user`
- `assistant`

`status` 可选值：

- `streaming`
- `completed`
- `failed`

## 健康检查

### 获取服务状态

```text
GET /api/health
```

响应示例：

```json
{
  "status": "ok",
  "provider": "openai"
}
```

## 认证接口

### 注册

```text
POST /api/auth/register
```

请求体：

```json
{
  "username": "student",
  "email": "student@example.com",
  "password": "123456"
}
```

字段说明：

- `username`：必填，2 到 50 个字符。
- `email`：可选，传入时必须是合法邮箱。
- `password`：必填，6 到 64 个字符。

成功响应：`201 Created`

```json
{
  "user": {
    "id": 2,
    "username": "student",
    "email": "student@example.com",
    "avatarUrl": null
  },
  "token": "jwt-token"
}
```

### 登录

```text
POST /api/auth/login
```

请求体：

```json
{
  "account": "admin",
  "password": "123456"
}
```

`account` 支持用户名或邮箱。

成功响应：

```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "avatarUrl": null
  },
  "token": "jwt-token"
}
```

### 获取当前用户

```text
GET /api/auth/me
```

需要鉴权。

成功响应：

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "avatarUrl": null
}
```

### 注销

```text
POST /api/auth/logout
```

需要鉴权。

成功响应：`204 No Content`

### 修改密码

```text
PATCH /api/auth/password
```

需要鉴权。

请求体：

```json
{
  "oldPassword": "123456",
  "newPassword": "new123456",
  "confirmPassword": "new123456"
}
```

成功响应：`204 No Content`

### 更新头像地址

```text
PATCH /api/auth/avatar
```

需要鉴权。

请求体：

```json
{
  "avatarUrl": "https://example.com/avatar.png"
}
```

成功响应：

```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "avatarUrl": "https://example.com/avatar.png"
  },
  "token": "new-jwt-token"
}
```

### 上传头像文件

```text
POST /api/auth/avatar/upload
```

需要鉴权。

请求格式：`multipart/form-data`

字段：

- `avatar`：头像文件。

成功响应：

```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "avatarUrl": "/uploads/avatars/example.png"
  },
  "token": "new-jwt-token"
}
```

上传后的文件可通过 `/uploads/avatars/<filename>` 访问。

## 会话接口

### 获取会话列表

```text
GET /api/conversations
```

需要鉴权。

成功响应：

```json
[
  {
    "id": 1,
    "title": "Vue 响应式",
    "model": "gpt-4.1-mini",
    "updatedAt": "2026-06-08T05:30:00.000Z"
  }
]
```

### 创建会话

```text
POST /api/conversations
```

需要鉴权。

请求体：

```json
{
  "title": "新的会话"
}
```

`title` 可选，未传或为空时使用 `新的会话`。

成功响应：`201 Created`

```json
{
  "id": 1,
  "title": "新的会话",
  "model": "gpt-4.1-mini",
  "updatedAt": "2026-06-08T05:30:00.000Z"
}
```

### 获取会话详情

```text
GET /api/conversations/:id
```

需要鉴权。

成功响应：

```json
{
  "id": 1,
  "title": "Vue 响应式",
  "model": "gpt-4.1-mini",
  "updatedAt": "2026-06-08T05:30:00.000Z",
  "messages": [
    {
      "id": 1,
      "conversationId": 1,
      "role": "user",
      "content": "请解释 Vue3 的 ref 和 reactive",
      "status": "completed",
      "createdAt": "2026-06-08T05:30:00.000Z"
    }
  ]
}
```

会话不存在时返回 `404`。

### 重命名会话

```text
PATCH /api/conversations/:id
```

需要鉴权。

请求体：

```json
{
  "title": "Vue 响应式学习"
}
```

成功响应：

```json
{
  "id": 1,
  "title": "Vue 响应式学习",
  "model": "gpt-4.1-mini",
  "updatedAt": "2026-06-08T05:35:00.000Z"
}
```

会话不存在时返回 `404`。

### 删除会话

```text
DELETE /api/conversations/:id
```

需要鉴权。

成功响应：`204 No Content`

后端当前使用软删除方式标记会话。

## 聊天接口

聊天接口使用 Server-Sent Events 返回流式内容。

响应头：

```text
Content-Type: text/event-stream; charset=utf-8
Cache-Control: no-cache, no-transform
Connection: keep-alive
```

### SSE 事件格式

每个事件使用 `data:` 行传递 JSON。

Token 事件：

```text
data: {"type":"token","content":"Vue"}
```

完成事件：

```text
data: {"type":"done"}
```

停止事件：

```text
data: {"type":"stopped"}
```

错误事件：

```text
data: {"type":"error","message":"AI 接口调用失败"}
```

### 发送消息并流式生成回复

```text
POST /api/chat/stream
```

需要鉴权。

请求体：

```json
{
  "conversationId": 1,
  "message": "请解释 Vue3 的 ref 和 reactive",
  "model": "gpt-4.1-mini"
}
```

字段说明：

- `conversationId`：必填，会话 ID。
- `message`：必填，用户本次发送的消息。
- `model`：可选，不传时使用会话模型或后端默认模型。

成功响应类型：`text/event-stream`

说明：

- 后端会先保存用户消息。
- 后端会创建一条 `streaming` 状态的助手消息。
- AI 生成完成后，助手消息状态更新为 `completed`。
- 如果这是默认标题会话的第一条用户消息，后端会尝试自动生成短标题。

### 重新生成上一条回复

```text
POST /api/chat/regenerate
```

需要鉴权。

请求体：

```json
{
  "conversationId": 1,
  "model": "gpt-4.1-mini"
}
```

字段说明：

- `conversationId`：必填，会话 ID。
- `model`：可选，不传时使用会话模型或后端默认模型。

成功响应类型：`text/event-stream`

说明：

- 后端会查找当前会话中最近一条用户消息。
- 如果最近一条助手消息晚于该用户消息，则先删除最近助手消息。
- 然后基于当前历史消息重新请求 AI 并流式返回结果。
- 如果没有可重新生成的用户消息，返回错误事件。
