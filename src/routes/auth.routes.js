import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

const router = Router();

const signupSchema = z.object({
  email: z.string().email().max(255).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(100),
  name: z.string().trim().min(1).max(100),
});

const loginSchema = z.object({
  email: z.string().email().max(255).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(100),
});

const toAuthResponse = (user) => {
  const isAdmin = env.adminEmails.has(user.email.toLowerCase());
  const token = jwt.sign(
    {
      email: user.email,
      isAdmin,
    },
    env.jwt.secret,
    {
      subject: String(user.id),
      expiresIn: env.jwt.expiresIn,
    },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin,
    },
  };
};

router.post('/signup', async (req, res, next) => {
  try {
    if (!env.signupEnabled) {
      return res.status(403).json({ message: 'Signup is disabled.' });
    }

    const body = signupSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(body.password, 12);

    const [result] = await pool.execute(
      `
        INSERT INTO users (email, password_hash, name)
        VALUES (:email, :passwordHash, :name)
      `,
      {
        email: body.email,
        passwordHash,
        name: body.name,
      },
    );

    const user = {
      id: result.insertId,
      email: body.email,
      name: body.name,
    };

    return res.status(201).json(toAuthResponse(user));
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const [rows] = await pool.execute(
      'SELECT id, email, password_hash, name FROM users WHERE email = :email LIMIT 1',
      { email: body.email },
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isValidPassword = await bcrypt.compare(body.password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json(toAuthResponse(user));
  } catch (error) {
    return next(error);
  }
});

export default router;
