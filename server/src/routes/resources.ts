import { Router } from 'express';
import * as resourceController from '../controllers/resources';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', resourceController.getAllResources);
router.get('/random', resourceController.getRandomResource);
router.get('/:id', resourceController.getResourceById);
router.post('/', requireAuth, requireAdmin, resourceController.createResource);
router.put('/:id', requireAuth, requireAdmin, resourceController.updateResource);
router.delete('/:id', requireAuth, requireAdmin, resourceController.deleteResource);

export default router;
