import { Router } from 'express';
import * as postController from './post.controller.js';
import { authenticateToken } from '../../common/middlewares/authMiddleware.js';
import { validate } from '../../common/middlewares/validate.js';
import { createPostSchema, updatePostSchema, getPostsSchema } from './post.schema.js';

const router = Router();

// manage routes (Specific routes first)
router.get('/manage', authenticateToken, postController.getAdminPosts);

// Public routes
router.get('/', validate(getPostsSchema), postController.getPosts);
router.get('/:id', postController.getPost);

// Protected routes (General middleware applied to all subsequent routes)
router.use(authenticateToken);

router.post('/', validate(createPostSchema), postController.createPost);
router.patch('/:id', validate(updatePostSchema), postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;
