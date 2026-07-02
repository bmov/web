import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { pool } from '../config/db.js';

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.get('authorization') ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const payload = jwt.verify(token, env.jwt.secret);
    const [rows] = await pool.execute(
      'SELECT id, email, name FROM users WHERE id = :id LIMIT 1',
      { id: payload.sub },
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }

    req.user = {
      ...user,
      isAdmin: env.adminEmails.has(user.email.toLowerCase()),
    };

    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }

    return next(error);
  }
};
