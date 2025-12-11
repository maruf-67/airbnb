import { Router } from 'express';
import * as userController from './users.controller.js';
import { authenticateToken } from '../../common/middlewares/authMiddleware.js';
import { checkPermission } from '../../common/middlewares/permissionMiddleware.js';
import { validate } from '../../common/middlewares/validate.js';
import { getUsersSchema, updateUserSchema } from './users.schema.js';

const router = Router();

// Protect all routes
router.use(authenticateToken);

// Admin only routes - checking for 'admin' permission or role type check
// Using checkPermission assumes 'manage_users' or similar exists.
// For now, let's assume checkPermission looks for permission string. 
// If based on Role Model 'type', we might need a different middleware or ensure admin role has 'manage_users'
// Let's assume 'manage_users' is the standard admin permission or use a specific one.
router.get('/', checkPermission('manage_users'), validate(getUsersSchema), userController.getUsers);
router.get('/:id', checkPermission('manage_users'), userController.getUser);
router.patch('/:id', checkPermission('manage_users'), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', checkPermission('manage_users'), userController.deleteUser);

export default router;
