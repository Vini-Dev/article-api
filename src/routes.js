import { Router } from 'express';

import fileUploadMiddleware from './app/middlewares/fileUpload';
import authMiddleware from './app/middlewares/auth';
import ArticleController from './app/controllers/ArticleController';
import ImageController from './app/controllers/ImageController';
import SessionController from './app/controllers/SessionController';
import TagController from './app/controllers/TagController';

const router = new Router();

/**
 * Public routes
 */
// Session
router.post('/sessions', SessionController.store);
router.get('/image/:fileName', ImageController.index);

/**
 * Private routes
 */
router.use(authMiddleware);

// Articles
router.get('/article/:id', ArticleController.index);
router.get('/articles', ArticleController.list);
router.post('/article', fileUploadMiddleware, ArticleController.store);
router.put('/article', fileUploadMiddleware, ArticleController.update);
router.delete('/article/:id', ArticleController.delete);

// Tag
router.get('/tag/:id', TagController.index);
router.get('/tags', TagController.list);
router.post('/tag', TagController.store);
router.put('/tag', TagController.update);
router.delete('/tag/:id', TagController.delete);

export default router;
