import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import ArticleController from './app/controllers/ArticleController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/authMiddleware';

const router = new Router();

// sessions
router.post('/sessions', SessionController.store);

router.use(authMiddleware);

router.get('/', (req, res) => {
  return res.json({ run: true });
});

router.get('/article/:id', ArticleController.index);
router.get('/articles', ArticleController.list);
router.post(
  '/article',
  multer(multerConfig).single('cover'),
  ArticleController.store
);
router.put('/article', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);

export default router;
