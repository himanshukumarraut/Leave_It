import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Express API running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server', err);
});
