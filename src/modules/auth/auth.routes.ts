import { Router } from 'express';
import { validate } from '../../common/middlewares/validate.js';
import * as AuthController from './auth.controller.js';
import { RegisterSchema, LoginSchema } from './auth.schema.js';
import { authenticateToken } from '../../common/middlewares/authMiddleware.js';
import { uploadAvatar } from '../../common/middlewares/upload.js';

const router = Router();

router.post('/register', validate(RegisterSchema), AuthController.register);
router.post('/login', validate(LoginSchema), AuthController.login);
router.post('/logout', authenticateToken, AuthController.logout);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/me', authenticateToken, AuthController.me);
router.patch('/profile', authenticateToken, AuthController.updateProfile);
router.post('/change-password', authenticateToken, AuthController.changePassword);
router.post('/avatar', authenticateToken, uploadAvatar.single('avatar'), AuthController.uploadAvatar);

export default router;
