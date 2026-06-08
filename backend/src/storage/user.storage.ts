import type { RowDataPacket } from 'mysql2';
import { pool } from './db.js';
import type { User } from '../types/user.js';

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string | null;
  password_hash: string | null;
  avatar_url: string | null;
  created_at: Date;
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at.toISOString()
  };
}

export async function findUserByUsernameOrEmail(account: string) {
  const [rows] = await pool.query<UserRow[]>(
    `SELECT id, username, email, password_hash, avatar_url, created_at
     FROM users
     WHERE username = ? OR email = ?
     LIMIT 1`,
    [account, account]
  );

  return rows[0] ?? null;
}

export async function findUserById(id: number) {
  const [rows] = await pool.query<UserRow[]>(
    `SELECT id, username, email, password_hash, avatar_url, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] ? mapUser(rows[0]) : null;
}

export async function createUser(params: {
  username: string;
  email?: string;
  passwordHash: string;
}) {
  const [result] = await pool.execute(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [params.username, params.email || null, params.passwordHash]
  );
  return findUserById(Number((result as { insertId: number }).insertId));
}

export async function updateUserAvatar(id: number, avatarUrl: string) {
  await pool.execute('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, id]);
  return findUserById(id);
}

export async function updateUserPassword(id: number, passwordHash: string) {
  await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

export async function upsertDemoAdmin(params: {
  username: string;
  email: string;
  passwordHash: string;
}) {
  await pool.execute(
    `INSERT INTO users (username, email, password_hash, avatar_url)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       email = VALUES(email),
       password_hash = COALESCE(password_hash, VALUES(password_hash)),
       avatar_url = COALESCE(avatar_url, VALUES(avatar_url))`,
    [params.username, params.email, params.passwordHash, 'preset:blue']
  );
}
