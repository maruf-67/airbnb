import express from 'express';
import * as RoleController from './role.controller.js';
import { validate } from '../../common/middlewares/validate.js';
import { createRoleSchema, updateRoleSchema } from './role.schema.js';
// import { authenticateToken } from '../../common/middlewares/authMiddleware.js'; // Assuming auth middleware exists

const router = express.Router();

// TODO: Add authentication and authorization middleware
// router.use(authenticateToken); 

router.post('/', validate(createRoleSchema), RoleController.createRole);
router.get('/', RoleController.getRoles);
router.get('/:id', RoleController.getRole);
router.patch('/:id', validate(updateRoleSchema), RoleController.updateRole);
router.delete('/:id', RoleController.deleteRole);

export default router;
