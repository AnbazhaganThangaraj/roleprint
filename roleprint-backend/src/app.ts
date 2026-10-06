import express from 'express';
import morgan from 'morgan';
import multer from 'multer';
import cvRoutes from './routes/cv.routes.js';
import matchRoutes from './routes/match.routes.js';
import { AppError } from './utils/errors.js';

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ message: 'Roleprint API is running' });
});

app.use('/api/match', matchRoutes);
app.use('/api/cv', cvRoutes);

app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    console.error(`[${req.method}] ${req.path} → ${err.statusCode} ${err.message}`);
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  if (err instanceof multer.MulterError) {
    const statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'The file is larger than 5 MB' : err.message;
    console.error(`[${req.method}] ${req.path} → ${statusCode} ${message}`);
    res.status(statusCode).json({ error: message });
    return;
  }
  const message = err instanceof Error ? err.message : 'Unknown error';
  const stack   = err instanceof Error ? err.stack : String(err);
  console.error(`[ERROR] [${req.method}] ${req.path}\n${stack ?? message}`);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
