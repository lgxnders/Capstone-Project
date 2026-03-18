import { Router } from 'express';
import * as userController from '../controllers/users';

const router = Router();

router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;