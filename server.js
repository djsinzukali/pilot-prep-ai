require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

// ROUTES
const authRoutes = require('./routes/auth.routes');
const quizRoutes = require('./routes/quiz.routes');
const testRoutes = require('./routes/test.routes');
const debugRoutes = require('./routes/debug.routes');

app.use('/', debugRoutes);
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/test', testRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',         
    environment: 'codespaces'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Pilot Prep AI Backend Running',
    status: 'ok'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
