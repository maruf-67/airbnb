import express from 'express';
import * as RoleController from './role.controller.js';
import { validate } from '../../common/middlewares/validate.js';
import { createRoleSchema, updateRoleSchema } from './role.schema.js';
import { authenticateToken } from '../../common/middlewares/authMiddleware.js';
import { checkPermission } from '../../common/middlewares/permissionMiddleware.js';

const router = express.Router();

// Apply Authentication to all role routes
router.use(authenticateToken);

router.post('/', checkPermission('role.create'), validate(createRoleSchema), RoleController.createRole);
router.get('/permissions', authenticateToken, RoleController.getPermissions); // Public-ish for authenticated users to see available perms
router.get('/', checkPermission('role.read'), RoleController.getRoles);
router.get('/:id', checkPermission('role.read'), RoleController.getRole);
router.patch('/:id', checkPermission('role.update'), validate(updateRoleSchema), RoleController.updateRole);
router.delete('/:id', checkPermission('role.delete'), RoleController.deleteRole);

export default router;
