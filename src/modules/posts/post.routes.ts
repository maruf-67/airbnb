import { Router } from 'express';
import * as postController from './post.controller.js';
import { authenticateToken } from '../../common/middlewares/authMiddleware.js';
import { validate } from '../../common/middlewares/validate.js';
import { createPostSchema, updatePostSchema, getPostsSchema } from './post.schema.js';

const router = Router();

// Public routes
router.get('/', validate(getPostsSchema), postController.getPosts);
router.get('/:id', postController.getPost);

// Protected routes
router.use(authenticateToken);

router.post('/', validate(createPostSchema), postController.createPost);
router.patch('/:id', validate(updatePostSchema), postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;
