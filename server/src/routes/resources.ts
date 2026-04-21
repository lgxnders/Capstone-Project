import { Router } from 'express';
import * as resourceController from '../controllers/resources';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', resourceController.getAllResources);
router.get('/random', resourceController.getRandomResource);
router.get('/:id', resourceController.getResourceById);
router.post('/', requireAdmin, resourceController.createResource);
router.put('/:id', requireAdmin, resourceController.updateResource);
router.delete('/:id', requireAdmin, resourceController.deleteResource);

export default router;
