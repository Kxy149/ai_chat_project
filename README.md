# AI 学习助手

基于 Vue 3、TypeScript、Vite、Element Plus、Node.js、Express、MySQL 和 AI API 构建的智能问答平台。

## 功能

- 多轮对话
- 会话列表管理和搜索
- Markdown 渲染
- 代码高亮
- AI 回复流式输出
- 停止生成和重新生成
- 登录、注册、注销
- 头像上传和默认头像
- OpenAI / DeepSeek 后端统一代理调用

## 演示账号

后端启动时会自动创建演示管理员账号：

```text
账号：admin
密码：123456
```

登录页也会默认填入该账号，方便查看项目。

## 启动方式

```bash
npm install
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

## 环境变量

复制 `.env.example` 为 `backend/.env`，并填写 AI API Key 和 MySQL 配置。

## 数据库

建表 SQL 位于：

```text
backend/database/schema.sql
```
