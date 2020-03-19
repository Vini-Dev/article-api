import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/authMiddleware';

const router = new Router();

// sessions
router.post('/sessions', SessionController.store);

router.use(authMiddleware);

router.get('/', (req, res) => {
  return res.json({ run: true });
});

export default router;
