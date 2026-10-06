import 'dotenv/config';
import app from './app.js';
import { prisma } from './config/db.js';

const port = Number(process.env.PORT ?? 4100);

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
