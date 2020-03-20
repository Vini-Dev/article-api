import { Router } from 'express';

import ImageController from './app/controllers/ImageController';
import ArticleController from './app/controllers/ArticleController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/authMiddleware';

// import multer from 'multer';
// import multerMiddleware from './app/middlewares/multer';
// multer(multerMiddleware).single('cover')

const router = new Router();

// sessions
router.post('/sessions', SessionController.store);
router.get('/image', ImageController.index);

// Abaixo somente rotas privadas
router.use(authMiddleware);

router.get('/', (req, res) => {
  return res.json({ run: true });
});

router.get('/article/:id', ArticleController.index);
router.get('/articles', ArticleController.list);
router.post('/article', ArticleController.store);
router.put('/article', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);

export default router;
