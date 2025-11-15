const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leaves');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Express API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
  }
}

start();
