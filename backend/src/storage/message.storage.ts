import type { RowDataPacket } from 'mysql2';
import { pool } from './db.js';
import type { ChatMessage, MessageRole } from '../types/chat.js';

interface MessageRow extends RowDataPacket {
  id: number;
  conversation_id: number;
  role: MessageRole;
  content: string;
  status: 'streaming' | 'completed' | 'failed';
  created_at: Date;
}

function mapMessage(row: MessageRow): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role,
    content: row.content,
    status: row.status,
    createdAt: row.created_at.toISOString()
  };
}

export async function listMessages(conversationId: number) {
  const [rows] = await pool.query<MessageRow[]>(
    `SELECT id, conversation_id, role, content, status, created_at
     FROM messages
     WHERE conversation_id = ?
     ORDER BY created_at ASC, id ASC`,
    [conversationId]
  );

  return rows.map(mapMessage);
}

export async function createMessage(params: {
  conversationId: number;
  role: MessageRole;
  content: string;
  model?: string;
  status?: 'streaming' | 'completed' | 'failed';
}) {
  const [result] = await pool.execute(
    `INSERT INTO messages (conversation_id, role, content, model, status)
     VALUES (?, ?, ?, ?, ?)`,
    [params.conversationId, params.role, params.content, params.model ?? null, params.status ?? 'completed']
  );

  return Number((result as { insertId: number }).insertId);
}

export async function updateMessageContent(id: number, content: string, status: 'streaming' | 'completed' | 'failed', errorMessage?: string) {
  await pool.execute(
    `UPDATE messages
     SET content = ?, status = ?, error_message = ?
     WHERE id = ?`,
    [content, status, errorMessage ?? null, id]
  );
}

export async function deleteMessage(id: number) {
  await pool.execute('DELETE FROM messages WHERE id = ?', [id]);
}
