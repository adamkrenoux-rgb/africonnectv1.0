import type { Request, Response } from 'express';
import * as usersService from '../services/usersService.ts';

export async function createUser(req: Request, res: Response) {
  const { email, fullName, role } = req.body || {};
  const user = await usersService.createUser({ email, fullName, role });
  res.status(201).json(user);
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  const user = await usersService.getUserById(id);
  res.json(user);
}
