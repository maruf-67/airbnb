import { Router } from 'express';
import { uploadFile } from './upload.controller.js';
import { upload } from './upload.middleware.js';
import { authenticateToken } from '../../common/middlewares/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/', upload.single('file'), uploadFile);

export default router;
