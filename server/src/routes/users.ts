import { Router } from 'express';
import * as userController from '../controllers/users';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/:id', requireAuth, userController.getUser);
router.patch('/:id', requireAuth, userController.updateUser);
router.delete('/:id', requireAuth, requireAdmin, userController.deleteUser);

export default router;