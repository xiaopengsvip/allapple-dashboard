import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getSetting, queryOne } from './db';
import { cookies } from 'next/headers';

async function getJwtSecret(): Promise<string> {
  return (await getSetting('jwt_secret')) || 'everett-dashboard-secret-key';
}

export interface UserPayload {
  id: string;
  username: string;
  role: string;
}

export async function signToken(user: UserPayload): Promise<string> {
  const secret = await getJwtSecret();
  return jwt.sign(user, secret, { expiresIn: '7d' });
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const secret = await getJwtSecret();
    return jwt.verify(token, secret) as UserPayload;
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

export async function authenticateUser(username: string, password: string): Promise<UserPayload | null> {
  const user = await queryOne('SELECT * FROM users WHERE username = $1', [username]);
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;
  return { id: user.id, username: user.username, role: user.role };
}
