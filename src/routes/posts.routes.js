import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { renderBbcode } from '../utils/renderBbcode.js';

const router = Router();

const createPostSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1),
});

const updatePostSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    content: z.string().trim().min(1).optional(),
  })
  .refine((value) => value.title !== undefined || value.content !== undefined, {
    message: 'At least one of title or content is required.',
  });

const pinPostSchema = z.object({
  isPinned: z.boolean(),
});

const listPostsQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

const toPostResponse = (post) => ({
  id: post.id,
  title: post.title,
  content: post.content,
  contentHtml: post.content_html,
  isPinned: Boolean(post.is_pinned),
  author: {
    id: post.user_id,
    email: post.author_email,
    name: post.author_name,
  },
  createdAt: post.created_at,
  updatedAt: post.updated_at,
});

const findPostById = async (id) => {
  const [rows] = await pool.execute(
    `
      SELECT
        p.id,
        p.user_id,
        p.title,
        p.content,
        p.content_html,
        p.is_pinned,
        p.created_at,
        p.updated_at,
        u.email AS author_email,
        u.name AS author_name
      FROM posts p
      INNER JOIN users u ON u.id = p.user_id
      WHERE p.id = :id
      LIMIT 1
    `,
    { id },
  );

  return rows[0] ?? null;
};

const canMutatePost = (user, post) => user.isAdmin || Number(post.user_id) === Number(user.id);

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const { offset, limit } = listPostsQuerySchema.parse(req.query);
    const [rows] = await pool.execute(
      `
        SELECT
          p.id,
          p.user_id,
          p.title,
          p.content,
          p.content_html,
          p.is_pinned,
          p.created_at,
          p.updated_at,
          u.email AS author_email,
          u.name AS author_name
        FROM posts p
        INNER JOIN users u ON u.id = p.user_id
        ORDER BY p.is_pinned DESC, p.id DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
    );

    return res.json({
      posts: rows.map(toPostResponse),
      pagination: {
        offset,
        limit,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const post = await findPostById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    return res.json({ post: toPostResponse(post) });
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = createPostSchema.parse(req.body);
    const contentHtml = renderBbcode(body.content);

    const [result] = await pool.execute(
      `
        INSERT INTO posts (user_id, title, content, content_html)
        VALUES (:userId, :title, :content, :contentHtml)
      `,
      {
        userId: req.user.id,
        title: body.title,
        content: body.content,
        contentHtml,
      },
    );

    const post = await findPostById(result.insertId);
    return res.status(201).json({ post: toPostResponse(post) });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const body = updatePostSchema.parse(req.body);
    const post = await findPostById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (!canMutatePost(req.user, post)) {
      return res.status(403).json({ message: 'Only the author or an administrator can update this post.' });
    }

    const contentHtml = body.content === undefined ? null : renderBbcode(body.content);

    await pool.execute(
      `
        UPDATE posts
        SET
          title = COALESCE(:title, title),
          content = COALESCE(:content, content),
          content_html = COALESCE(:contentHtml, content_html)
        WHERE id = :id
      `,
      {
        id,
        title: body.title ?? null,
        content: body.content ?? null,
        contentHtml,
      },
    );

    const updatedPost = await findPostById(id);
    return res.json({ post: toPostResponse(updatedPost) });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id/pin', async (req, res, next) => {
  try {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const body = pinPostSchema.parse(req.body);
    const post = await findPostById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Only the administrator can pin this post.' });
    }

    await pool.execute('UPDATE posts SET is_pinned = :isPinned WHERE id = :id', {
      id,
      isPinned: body.isPinned ? 1 : 0,
    });

    const updatedPost = await findPostById(id);
    return res.json({ post: toPostResponse(updatedPost) });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const post = await findPostById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (!canMutatePost(req.user, post)) {
      return res.status(403).json({ message: 'Only the author or an administrator can delete this post.' });
    }

    await pool.execute('DELETE FROM posts WHERE id = :id', { id });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
