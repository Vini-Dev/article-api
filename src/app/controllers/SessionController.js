import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { login, password } = req.body;

    if (login !== 'admin' || password !== '123456') {
      res.status(401).json({
        message: 'Login ou senha inválidos',
      });
    }

    return res.json({
      token: jwt.sign({ id: 1 }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
