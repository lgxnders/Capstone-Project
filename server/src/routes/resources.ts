import { Router } from 'express';
import * as resourceController from '../controllers/resources';

const router = Router();

router.get('/', resourceController.getAllResources);
router.get('/random', resourceController.getRandomResource);
router.get('/:id', resourceController.getResourceById);

export default router;
