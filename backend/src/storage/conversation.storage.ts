import type { RowDataPacket } from 'mysql2';
import { pool } from './db.js';
import type { Conversation } from '../types/chat.js';

interface ConversationRow extends RowDataPacket {
  id: number;
  title: string;
  model: string;
  updated_at: Date;
}

function mapConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    title: row.title,
    model: row.model,
    updatedAt: row.updated_at.toISOString()
  };
}

export async function listConversations(userId: number) {
  const [rows] = await pool.query<ConversationRow[]>(
    `SELECT id, title, model, updated_at
     FROM conversations
     WHERE user_id = ? AND deleted_at IS NULL
     ORDER BY updated_at DESC`,
    [userId]
  );

  return rows.map(mapConversation);
}

export async function createConversation(userId: number, title: string, model: string) {
  const [result] = await pool.execute(
    'INSERT INTO conversations (user_id, title, model) VALUES (?, ?, ?)',
    [userId, title, model]
  );
  const id = Number((result as { insertId: number }).insertId);
  return getConversationById(id, userId);
}

export async function getConversationById(id: number, userId: number) {
  const [rows] = await pool.query<ConversationRow[]>(
    `SELECT id, title, model, updated_at
     FROM conversations
     WHERE id = ? AND user_id = ? AND deleted_at IS NULL
     LIMIT 1`,
    [id, userId]
  );

  return rows[0] ? mapConversation(rows[0]) : null;
}

export async function renameConversation(id: number, userId: number, title: string) {
  await pool.execute('UPDATE conversations SET title = ? WHERE id = ? AND user_id = ?', [title, id, userId]);
  return getConversationById(id, userId);
}

export async function touchConversation(id: number) {
  await pool.execute('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
}

export async function softDeleteConversation(id: number, userId: number) {
  await pool.execute('UPDATE conversations SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [id, userId]);
}
