import { Router } from 'express';
import userRoutes from './users.js'
import fileRoutes from './files.js'

const router = Router();

router.use(userRoutes);
router.use(fileRoutes);

export default router;