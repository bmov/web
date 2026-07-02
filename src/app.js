import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, '../dist/client');

export const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

app.use(express.static(clientDistPath));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);
