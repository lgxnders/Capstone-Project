import { Router } from 'express';
import * as authController from '../controllers/auth';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', requireAuth, authController.me);

export default router;