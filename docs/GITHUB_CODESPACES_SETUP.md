# GitHub Codespaces Setup Guide

**For cloud-based development with Docker support included**

---

## What is GitHub Codespaces?

GitHub Codespaces provides a cloud-based development environment directly from your browser. It includes:

✅ **Full Docker support** (no local Docker needed)  
✅ **Pre-configured VS Code** in the browser  
✅ **Free tier**: 60 hours/month per user  
✅ **Auto-suspend** after 30 minutes of inactivity  
✅ **All tools pre-installed**: Node.js, PostgreSQL, Redis, Git  

---

## Quick Start (2 Minutes)

### Step 1: Create Codespace

1. Go to your repository: https://github.com/djsinzukali/pilot-prep-ai
2. Click **"Code"** → **"Codespaces"** tab
3. Click **"Create codespace on main"**
4. Wait ~2 minutes for environment to spin up

---

### Step 2: Initialize Services

**In the Codespaces terminal, run:**

```bash
# The environment is pre-configured, but let's verify

# 1. Create backend directory
mkdir -p backend frontend scripts

# 2. Install backend dependencies
cd backend
npm init -y
npm install express dotenv pg redis cors helmet jwt-simple nodemon

# 3. Create initial server
cat > src/server.js << 'EOF'
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', environment: 'codespaces' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
EOF

# 4. Create .env
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pilotprep_dev
DB_USER=postgres
DB_PASSWORD=postgres
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=dev_secret_key_codespaces
OPENAI_API_KEY=sk-your-key-here
YOUTUBE_API_KEY=your-key-here
EOF

# 5. Start backend
npm start
```

---

## Using Docker in Codespaces

### Option 1: Docker Compose (Recommended)

**Create `docker-compose.yml` in repo root:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: pilotprep_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=pilotprep_dev
      - DB_USER=postgres
      - DB_PASSWORD=postgres
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app
    command: npm run dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
    command: npm run dev

volumes:
  postgres_data:
```

**Create `backend/Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
```

**Create `frontend/Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

**Start services:**

```bash
# In Codespaces terminal
docker-compose up -d

# Verify services
docker-compose ps

# View logs
docker-compose logs -f backend
```

---

### Option 2: Individual Docker Containers

```bash
# PostgreSQL
docker run -d \
  --name pilot-postgres \
  -e POSTGRES_DB=pilotprep_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Redis
docker run -d \
  --name pilot-redis \
  -p 6379:6379 \
  redis:7-alpine

# Verify
docker ps
```

---

## Codespaces Development Workflow

### Forwarding Ports

By default, Codespaces forwards these ports:
- `:3000` - Frontend (React)
- `:5000` - Backend (Express)
- `:5432` - PostgreSQL
- `:6379` - Redis

**Access from browser:**
```
Frontend: https://your-username-pilot-prep-ai-xxxxx.github.dev:3000
Backend:  https://your-username-pilot-prep-ai-xxxxx.github.dev:5000
```

---

### Accessing Database in Codespaces

```bash
# Connect to PostgreSQL
psql -h localhost -U postgres -d pilotprep_dev

# Or via pgAdmin (optional)
# Add pgAdmin service to docker-compose.yml
```

---

### Installing Additional Tools

Codespaces includes most tools, but if you need more:

```bash
# Install global packages
npm install -g typescript ts-node

# Update system packages
sudo apt-get update
sudo apt-get install -y [package-name]

# Install Homebrew tools (on Linux container)
brew install [tool-name]
```

---

## Best Practices

### 1. Save Work Frequently

Codespaces auto-saves VS Code files, but commit to Git:

```bash
git add .
git commit -m "Feature: Quiz generation setup"
git push origin main
```

---

### 2. Monitor Free Tier Usage

- **Free tier**: 60 hours/month per user
- **Monitor**: Settings → Codespaces → See usage stats
- **Auto-suspend**: 30 minutes of inactivity = automatic stop
- **Delete unused**: Delete old codespaces to free hours

---

### 3. Use Terminal Sessions Wisely

Keep multiple terminals for different tasks:
- **Terminal 1**: Backend (`npm run dev`)
- **Terminal 2**: Frontend (`npm run dev`)
- **Terminal 3**: Database migrations/scripts
- **Terminal 4**: Testing (`npm test`)

---

### 4. Sync Local Work

To sync Codespaces work with local machine:

```bash
# Push changes
git push origin feature-branch

# Pull in local environment
git pull origin feature-branch

# Or use GitHub Desktop app
```

---

## Troubleshooting

### Problem: Services won't start

**Solution**:
```bash
# Restart Docker daemon
docker restart

# Or restart Codespace
# Click "Codespaces" in bottom left → "Rebuild Codespace"
```

---

### Problem: Port already in use

**Solution**:
```bash
# Find process using port
lsof -i :5000

# Kill it
kill -9 <PID>

# Or restart Codespace
```

---

### Problem: Out of storage

**Solution**:
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Clear npm cache
npm cache clean --force
```

---

### Problem: Database connection refused

**Solution**:
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Restart if needed
docker restart pilot-postgres

# Test connection
psql -h localhost -U postgres -c "SELECT 1"
```

---

## Codespaces vs Local Development

| Feature | Codespaces | Local (No Docker) |
|---------|-----------|------------------|
| Setup Time | 2 minutes | 30+ minutes |
| Docker Support | ✅ Yes | ❌ No |
| Free Cost | ✅ 60 hrs/month | ✅ Free |
| Performance | Good (cloud) | Excellent (local) |
| Offline Use | ❌ No | ✅ Yes |
| Portability | ✅ Same everywhere | 🔄 OS-dependent |
| Collaboration | ✅ Easy sharing | 🔄 Need setup sharing |

---

## Quick Commands Reference

```bash
# Create new Codespace
# Go to repo → Code → Codespaces → Create codespace on main

# Codespaces terminal basics
docker-compose up -d           # Start services
docker-compose logs -f backend # View logs
docker-compose down            # Stop services
docker ps                       # List containers
docker exec -it <container> bash # Enter container

# Backend development
cd backend && npm run dev       # Start with hot reload
npm test                        # Run tests
npm run lint                    # Lint code

# Database
psql -h localhost -U postgres   # Connect to PostgreSQL
redis-cli                       # Connect to Redis

# Git
git status                      # Check changes
git add .                       # Stage all
git commit -m "msg"             # Commit
git push origin feature-branch  # Push to remote
```

---

## Next Steps

1. **Create Codespace** → `Code` → `Codespaces` → `Create codespace on main`
2. **Initialize project** → Run setup commands above
3. **Verify services** → `docker-compose ps`
4. **Open frontend** → Click URL from port forwarding
5. **Start developing** → Make changes and commit

---

## Resources

- **GitHub Codespaces Docs**: https://docs.github.com/en/codespaces
- **Docker Docs**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Pricing**: https://github.com/features/codespaces/pricing

---

**Tip**: Codespaces is perfect for getting started quickly without system dependencies. Switch to local development later for better performance.
