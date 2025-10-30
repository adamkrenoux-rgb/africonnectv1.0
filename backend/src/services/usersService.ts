import type { User } from '../models/user.ts';

const users = new Map<string, User>();

function generateId() {
  return Math.random().toString(36).slice(2);
}

export async function createUser(input: { email: string; fullName: string; role: User['role'] }): Promise<User> {
  if (!input?.email || !input?.fullName || !input?.role) {
    const error: any = new Error('email, fullName, and role are required');
    error.status = 400;
    throw error;
  }
  const now = new Date();
  const id = generateId();
  const user: User = {
    id,
    email: input.email,
    fullName: input.fullName,
    role: input.role,
    createdAt: now,
    updatedAt: now
  };
  users.set(id, user);
  return user;
}

export async function getUserById(id: string): Promise<User> {
  const user = users.get(id);
  if (!user) {
    const error: any = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return user;
}
