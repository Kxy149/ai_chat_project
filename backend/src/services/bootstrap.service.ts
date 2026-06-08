import bcrypt from 'bcryptjs';
import { upsertDemoAdmin } from '../storage/user.storage.js';

export async function ensureDemoAdmin() {
  const passwordHash = await bcrypt.hash('123456', 10);

  await upsertDemoAdmin({
    username: 'admin',
    email: 'admin@example.com',
    passwordHash
  });
}
