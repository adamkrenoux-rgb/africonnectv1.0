import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import * as usersController from '../controllers/usersController.ts';

const router = Router();

router.post('/', asyncHandler(usersController.createUser));
router.get('/:id', asyncHandler(usersController.getUserById));

export default router;
