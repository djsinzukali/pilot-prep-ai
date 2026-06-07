# Local Development Setup Guide - Without Docker

**For developers who cannot use Docker on their local machine**

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (PostgreSQL)](#database-setup-postgresql)
3. [Cache Setup (Redis)](#cache-setup-redis)
4. [Node.js & Backend Setup](#nodejs--backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **OS**: macOS, Windows (WSL2), or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 5GB free
- **Node.js**: 18.0 or higher

### Required Software
- PostgreSQL 15+
- Redis 7+
- Node.js 18+
- Git
- A code editor (VS Code recommended)

---

## Database Setup (PostgreSQL)

### macOS Setup

**Step 1: Install PostgreSQL**
```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

**Step 2: Create Database User**
```bash
# Connect to PostgreSQL
psql postgres

# Create database user (inside psql)
CREATE USER pilotprep WITH PASSWORD 'dev_password_123';
ALTER ROLE pilotprep WITH CREATEDB;
\q

# Verify user created
psql -U pilotprep -d postgres -c "SELECT 1"
```

**Step 3: Create Development Database**
```bash
createdb -U pilotprep pilotprep_dev
createdb -U pilotprep pilotprep_test
```

---

### Windows Setup (WSL2)

**Step 1: Install PostgreSQL in WSL2**
```bash
# In WSL2 terminal
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start

# Verify
psql --version
```

**Step 2: Create Database & User**
```bash
# Switch to postgres user
sudo -u postgres psql

# Create user and databases (inside psql)
CREATE USER pilotprep WITH PASSWORD 'dev_password_123';
ALTER ROLE pilotprep WITH CREATEDB;
CREATE DATABASE pilotprep_dev OWNER pilotprep;
CREATE DATABASE pilotprep_test OWNER pilotprep;
\q
```

**Step 3: Enable WSL2 Database Access**
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Find and change: listen_addresses = 'localhost'
# To: listen_addresses = '*'

# Save and restart
sudo service postgresql restart
```

---

### Linux Setup (Ubuntu/Debian)

**Step 1: Install PostgreSQL**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
psql --version
```

**Step 2: Create User & Databases**
```bash
sudo -u postgres psql

# Inside psql
CREATE USER pilotprep WITH PASSWORD 'dev_password_123';
ALTER ROLE pilotprep WITH CREATEDB;
CREATE DATABASE pilotprep_dev OWNER pilotprep;
CREATE DATABASE pilotprep_test OWNER pilotprep;
\q
```

---

## Cache Setup (Redis)

### macOS Setup

**Step 1: Install Redis**
```bash
brew install redis

# Start Redis service
brew services start redis

# Verify
redis-cli ping
# Should return: PONG
```

**Step 2: Verify Redis Connection**
```bash
# Test connection
redis-cli
> SET test_key "hello"
> GET test_key
> DEL test_key
> EXIT
```

---

### Windows Setup (WSL2)

**Step 1: Install Redis**
```bash
# In WSL2 terminal
sudo apt-get install redis-server

# Start Redis
sudo service redis-server start

# Verify
redis-cli ping
# Should return: PONG
```

---

### Linux Setup

**Step 1: Install Redis**
```bash
sudo apt-get install redis-server

# Start service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify
redis-cli ping
# Should return: PONG
```

---

## Node.js & Backend Setup

### Step 1: Install Node.js

**macOS**
```bash
brew install node@18
node --version  # Should be v18.x or higher
npm --version
```

**Windows (WSL2 or Native)**
```bash
# Via Node Version Manager (nvm) - Recommended
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

**Linux**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

### Step 2: Clone Repository

```bash
git clone https://github.com/djsinzukali/pilot-prep-ai.git
cd pilot-prep-ai

# Create main backend directory structure
mkdir -p backend frontend docs scripts
```

---

### Step 3: Backend Setup

**Create backend structure:**
```bash
cd backend

# Create package.json
npm init -y

# Install dependencies
npm install express dotenv pg redis cors helmet jwt-simple nodemon
npm install --save-dev jest supertest eslint prettier

# Create essential files
mkdir -p src routes controllers models middleware tests config
```

**Create `backend/package.json`:**
```json
{
  "name": "pilot-prep-ai-backend",
  "version": "1.0.0",
  "description": "AI-Powered Aviation Learning Platform - Backend",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "lint": "eslint src/",
    "migrate": "node scripts/migrate.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "pg": "^8.8.0",
    "redis": "^4.6.5",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "jwt-simple": "^0.5.6"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.5.0",
    "supertest": "^6.3.3",
    "eslint": "^8.38.0",
    "prettier": "^2.8.7"
  }
}
```

**Create `backend/src/server.js`:**
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes placeholder
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/progress', require('./routes/progress'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
```

---

## Frontend Setup

### Step 1: Create React Application

```bash
cd pilot-prep-ai

# Create frontend with Vite (faster than CRA)
npm create vite@latest frontend -- --template react
cd frontend
npm install

# Install additional dependencies
npm install axios react-router-dom redux react-redux chart.js react-chartjs-2
npm install --save-dev tailwindcss postcss autoprefixer
npm install -D @vitejs/plugin-react

# Initialize Tailwind
npx tailwindcss init -p
```

**Create `frontend/vite.config.js`:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

---

## Environment Configuration

### Step 1: Create Backend `.env` File

**`backend/.env`:**
```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pilotprep_dev
DB_USER=pilotprep
DB_PASSWORD=dev_password_123
DB_POOL_MIN=2
DB_POOL_MAX=10

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRY=7d

# API Configuration
API_BASE_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000

# OpenAI Configuration
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000

# YouTube Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_QUOTA_LIMIT=10000

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json

# Email Configuration (Optional)
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-app-password

# Feature Flags
ENABLE_EXPERIMENTS=true
CACHE_TTL=3600
```

**`backend/.env.test`:**
```env
NODE_ENV=test
PORT=5001
DB_NAME=pilotprep_test
REDIS_DB=1
LOG_LEVEL=error
```

---

### Step 2: Create Frontend `.env` File

**`frontend/.env`:**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=PilotPrep AI
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

---

### Step 3: Create Database Initialization Script

**`backend/scripts/migrate.js`:**
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const initSchema = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  topic VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  question_count INT NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  topic VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer VARCHAR(1) NOT NULL,
  explanation JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  question_id UUID NOT NULL REFERENCES questions(id),
  selected_answer VARCHAR(1),
  is_correct BOOLEAN,
  response_time_seconds INT,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  topic VARCHAR(50),
  total_attempts INT DEFAULT 0,
  correct_answers INT DEFAULT 0,
  average_score FLOAT DEFAULT 0,
  last_attempted TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON users(id);
CREATE INDEX idx_user_quizzes ON quizzes(user_id);
CREATE INDEX idx_quiz_questions ON questions(quiz_id);
CREATE INDEX idx_user_responses ON user_responses(user_id);
CREATE INDEX idx_user_progress ON user_progress(user_id);
`;

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running database migrations...');
    await client.query(initSchema);
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
```

---

## Running the Application

### Step 1: Initialize Database

```bash
cd backend
npm run migrate
```

Expected output:
```
🔄 Running database migrations...
✅ Database migrations completed successfully
```

---

### Step 2: Start Backend Server

**Terminal 1: Backend**
```bash
cd backend
npm run dev

# Expected output:
# 🚀 Backend server running on http://localhost:5000
```

---

### Step 3: Start Frontend Server

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev

# Expected output:
# ➜  Local:   http://localhost:3000/
# ➜  press h to show help
```

---

### Step 4: Verify Services

**Terminal 3: Verification**
```bash
# Check backend health
curl http://localhost:5000/health

# Check database connection
psql -U pilotprep -d pilotprep_dev -c "SELECT 1"

# Check Redis
redis-cli ping
```

Expected outputs:
```json
{"status":"healthy","timestamp":"2026-06-06T...","environment":"development"}
```
```
1
```
```
PONG
```

---

## Troubleshooting

### PostgreSQL Issues

**Problem**: `psql: error: could not connect to server`

**Solution**:
```bash
# macOS
brew services restart postgresql@15

# Linux/WSL2
sudo systemctl restart postgresql

# Verify
psql -U pilotprep -d pilotprep_dev -c "SELECT 1"
```

---

**Problem**: `FATAL: role "pilotprep" does not exist`

**Solution**:
```bash
# Recreate user
psql -U postgres -c "CREATE USER pilotprep WITH PASSWORD 'dev_password_123';"
psql -U postgres -c "ALTER ROLE pilotprep WITH CREATEDB;"
psql -U postgres -c "CREATE DATABASE pilotprep_dev OWNER pilotprep;"
```

---

### Redis Issues

**Problem**: `Error: connect ECONNREFUSED`

**Solution**:
```bash
# macOS
brew services restart redis

# Linux/WSL2
sudo systemctl restart redis-server

# Verify
redis-cli ping
```

---

### Node.js Issues

**Problem**: `npm: command not found`

**Solution**:
```bash
# Verify Node installation
node --version
npm --version

# If not found, reinstall Node.js
# macOS
brew install node@18

# Linux
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

**Problem**: `Port 5000 already in use`

**Solution**:
```bash
# Find and kill process using port 5000
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows (in PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

---

### Environment Variable Issues

**Problem**: `Cannot find module 'dotenv'` or env variables not loading

**Solution**:
```bash
# Reinstall dependencies
cd backend
npm install

# Verify .env file exists and is readable
ls -la .env
cat .env | head -5
```

---

## Development Workflow

### Daily Startup

```bash
# Terminal 1: Database & Cache
# Verify PostgreSQL and Redis running
psql -U pilotprep -d pilotprep_dev -c "SELECT 1"
redis-cli ping

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev

# Open browser
open http://localhost:3000
```

---

### Common Development Commands

```bash
# Backend tests
cd backend
npm test

# Backend linting
npm run lint

# Frontend build
cd frontend
npm run build

# Frontend tests
npm run test

# Database migrations
cd backend
npm run migrate

# Clean cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. ✅ Verify all services running
2. ✅ Test API endpoints
3. ✅ Create first feature branch
4. ✅ Begin Phase 1 development

**Useful Links**:
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Redis Docs: https://redis.io/documentation/
- Express.js: https://expressjs.com/
- React: https://react.dev/

---

**Questions?** Refer to individual service documentation or the project README.
