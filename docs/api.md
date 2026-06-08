# API 接口文档

## 聊天

### 流式聊天

```text
POST /api/chat/stream
```

请求体：

```json
{
  "conversationId": 1,
  "message": "请解释 Vue3 的 ref 和 reactive",
  "model": "gpt-4.1-mini"
}
```

响应类型：`text/event-stream`

## 会话

```text
GET    /api/conversations
POST   /api/conversations
GET    /api/conversations/:id
PATCH  /api/conversations/:id
DELETE /api/conversations/:id
```
