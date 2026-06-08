import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db, { getSetting } from './db';
import { cookies } from 'next/headers';

function getJwtSecret(): string {
  return getSetting('jwt_secret') || 'everett-dashboard-secret-key';
}

export interface UserPayload {
  id: string;
  username: string;
  role: string;
}

export function signToken(user: UserPayload): string {
  return jwt.sign(user, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as UserPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function authenticateUser(username: string, password: string): UserPayload | null {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;
  return { id: user.id, username: user.username, role: user.role };
}
