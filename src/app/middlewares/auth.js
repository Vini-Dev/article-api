import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');
  try {
    const tokenDecoded = await promisify(jwt.verify)(token, authConfig.secret);

    if (!tokenDecoded) {
      return res.status(401).json({ error: 'Decoded token error' });
    }

    req.body = {
      ...req.body,
      user_id: tokenDecoded.id,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
