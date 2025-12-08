import {
    Router
} from 'express';
import {
    validate
} from '../../common/middlewares/validate.js';
import * as AuthController from './auth.controller.js';
import {
    RegisterSchema,
    LoginSchema
} from './auth.schema.js';

const router = Router();

router.post('/register', validate(RegisterSchema), AuthController.register);
router.post('/login', validate(LoginSchema), AuthController.login);

export default router;