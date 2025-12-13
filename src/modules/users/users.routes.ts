import { Router } from 'express';
import * as userController from './users.controller.js';
import { authenticateToken } from '../../common/middlewares/authMiddleware.js';
import { checkPermission } from '../../common/middlewares/permissionMiddleware.js';
import { validate } from '../../common/middlewares/validate.js';
import { getUsersSchema, updateUserSchema, createUserSchema } from './users.schema.js';

const router = Router();

// Protect all routes
router.use(authenticateToken);

// Admin only routes
router.post('/', checkPermission('manage_users'), validate(createUserSchema), userController.createUser);
router.get('/', checkPermission('manage_users'), validate(getUsersSchema), userController.getUsers);
router.get('/:id', checkPermission('manage_users'), userController.getUser);
router.put('/:id', checkPermission('manage_users'), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', checkPermission('manage_users'), userController.deleteUser);

export default router;
