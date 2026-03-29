import { Router } from 'express';
import * as chatController from '../controllers/chat';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/message', requireAuth, chatController.sendMessage);
router.get('/history', requireAuth, chatController.getHistory);

export default router;