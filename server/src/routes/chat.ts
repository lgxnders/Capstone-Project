import { Router } from 'express';
import * as chatController from '../controllers/chat';

const router = Router();

router.post('/message', chatController.sendMessage);
router.get('/history', chatController.getHistory);

export default router;