import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const createContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z
    .string()
    .trim()
    .email()
    .max(255)
    .transform((value) => value.toLowerCase()),
  message: z.string().trim().min(1).max(2000),
});

const listContactQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const toContactResponse = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  message: row.message,
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
});

const ensureAdmin = (req, res) => {
  if (!req.user?.isAdmin) {
    res.status(403).json({
      message: 'Only the administrator can read contact messages.',
    });
    return false;
  }

  return true;
};

router.post('/', async (req, res, next) => {
  try {
    const body = createContactSchema.parse(req.body);

    await pool.execute(
      `
        INSERT INTO contact_messages (name, email, message)
        VALUES (:name, :email, :message)
      `,
      {
        name: body.name,
        email: body.email,
        message: body.message,
      },
    );

    return res.status(201).json({
      message: 'Your message has been sent successfully.',
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { offset, limit } = listContactQuerySchema.parse(req.query);

    const [rows] = await pool.execute(
      `
        SELECT id, name, email, message, created_at
        FROM contact_messages
        ORDER BY id DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
    );

    return res.json({
      messages: rows.map(toContactResponse),
      pagination: {
        offset,
        limit,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const id = z.coerce.number().int().positive().parse(req.params.id);
    const [rows] = await pool.execute(
      `
        SELECT id, name, email, message, created_at
        FROM contact_messages
        WHERE id = :id
        LIMIT 1
      `,
      { id },
    );

    const message = rows[0];
    if (!message) {
      return res.status(404).json({ message: 'Contact message not found.' });
    }

    return res.json({ message: toContactResponse(message) });
  } catch (error) {
    return next(error);
  }
});

export default router;
