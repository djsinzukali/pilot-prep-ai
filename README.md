# PilotPrep AI - README

**AI-Powered Aviation Learning Platform**

Transform aviation training through intelligent quizzes, real-world accident studies, and multimedia learning.

---

## 🎯 Project Overview

PilotPrep AI is a comprehensive learning platform for aspiring pilots and aviation enthusiasts. It combines:

- **AI-Generated Quizzes** across 8 aviation domains
- **Intelligent Explanations** grounded in FAA/ICAO regulations
- **Multimedia Learning** via YouTube integration
- **Real-World Case Studies** from famous aviation accidents
- **Adaptive Learning** that personalizes to each student
- **Progress Analytics** to track certification readiness

**Current Status**: Planning Phase → Development Starting  
**Timeline**: 16 weeks across 4 phases  
**Team**: Solo developer (looking to expand)

---

## 🚀 Quick Start

### Option 1: GitHub Codespaces (Easiest - 2 minutes)

```bash
# 1. Go to https://github.com/djsinzukali/pilot-prep-ai
# 2. Click "Code" → "Codespaces" → "Create codespace on main"
# 3. Wait ~2 minutes for environment
# 4. In terminal: docker-compose up -d
# 5. Open http://localhost:3000
```

[Full Guide →](docs/GITHUB_CODESPACES_SETUP.md)

---

### Option 2: Local Development (Without Docker)

```bash
# 1. Install PostgreSQL, Redis, Node.js
# 2. Clone repository
git clone https://github.com/djsinzukali/pilot-prep-ai.git
cd pilot-prep-ai

# 3. Set up backend
cd backend
npm install
npm run migrate
npm run dev

# 4. Set up frontend (new terminal)
cd frontend
npm install
npm run dev

# 5. Open http://localhost:3000
```

[Full Guide →](docs/LOCAL_DEVELOPMENT_SETUP.md)

---

## 📋 Project Structure

```
pilot-prep-ai/
├── docs/
│   ├── PROJECT_PLAN.md                 # Complete roadmap & specifications
│   ├── FEATURE_001_QUIZ_GENERATOR.md   # Quiz generation spec
│   ├── FEATURE_002_ANSWER_EXPLANATIONS.md # Explanation spec
│   ├── GITHUB_ISSUES_AND_TASKS.md      # Development tasks
│   ├── LOCAL_DEVELOPMENT_SETUP.md      # Local dev guide
│   └── GITHUB_CODESPACES_SETUP.md      # Codespaces guide
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── middleware/
│   ├── package.json
│   ├── .env
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── scripts/
│   └── migrate.js
├── docker-compose.yml
└── README.md
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [PROJECT_PLAN.md](docs/PROJECT_PLAN.md) | 📋 Complete project scope, features, architecture, roadmap |
| [FEATURE_001_QUIZ_GENERATOR.md](docs/FEATURE_001_QUIZ_GENERATOR.md) | 🎯 Quiz generation specification |
| [FEATURE_002_ANSWER_EXPLANATIONS.md](docs/FEATURE_002_ANSWER_EXPLANATIONS.md) | 💡 Explanation generation spec |
| [GITHUB_ISSUES_AND_TASKS.md](docs/GITHUB_ISSUES_AND_TASKS.md) | ✅ Development tasks for all 4 phases |
| [LOCAL_DEVELOPMENT_SETUP.md](docs/LOCAL_DEVELOPMENT_SETUP.md) | 🖥️ Local development without Docker |
| [GITHUB_CODESPACES_SETUP.md](docs/GITHUB_CODESPACES_SETUP.md) | ☁️ Cloud development with Codespaces |

---

## 🎓 Features

### Phase 1: Foundation (Weeks 1-4) - MVP

✅ **AI Quiz Generator**
- Generate questions across 8 aviation topics
- 3 difficulty levels (Beginner/Intermediate/Advanced)
- Questions cached for efficiency

✅ **AI Answer Explanations**
- Multi-layer explanations (correct, incorrect, learning notes)
- Regulatory citations (FAA/ICAO)
- Cross-topic linking

✅ **Progress Tracking**
- Dashboard with analytics
- Topic-level performance
- Weak topic identification

✅ **Study Assistant**
- Conversational AI chatbot
- Real-time aviation Q&A
- Context-aware responses

---

### Phase 2: Multimedia (Weeks 5-8)

🎥 **YouTube Integration**
- Video search by topic
- Metadata caching
- Embedded player

📚 **Resource Library**
- FAA publications
- Aviation handbooks
- Curated content

---

### Phase 3: Case Studies (Weeks 9-12)

💥 **Accident Investigation Library**
- 7+ major aviation accidents
- AI-generated analysis
- Interactive scenarios

🧠 **Decision-Making Scenarios**
- Realistic emergency situations
- Branching decision trees
- Feedback & scoring

---

### Phase 4: Advanced (Weeks 13-16)

📊 **Advanced Analytics**
- Adaptive difficulty
- Personalized recommendations
- Certification readiness prediction

🕐 **Aviation History Timeline**
- Interactive exploration
- Historical context
- Cross-topic links

👨‍🏫 **AI Flight Instructor Mentor**
- Personal instructor persona
- Readiness assessments
- Custom guidance

---

## 🛠️ Tech Stack

**Frontend**
- React 18+
- Vite (build tool)
- Tailwind CSS
- Chart.js (analytics)

**Backend**
- Node.js 18+
- Express.js
- PostgreSQL 15+
- Redis 7+

**AI & Integration**
- OpenAI GPT-4 API
- YouTube Data API v3
- LangChain

**DevOps**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- GitHub Codespaces

---

## 📊 API Overview

### Core Endpoints

```
Authentication
  POST   /api/auth/register
  POST   /api/auth/login

Quizzes
  POST   /api/quizzes              # Generate quiz
  GET    /api/quizzes/:id          # Get questions
  POST   /api/quizzes/:id/submit   # Submit answers

Study Assistant
  POST   /api/assistant/ask        # Ask question
  GET    /api/assistant/history    # Chat history

Progress
  GET    /api/progress             # Overall progress
  GET    /api/progress/:topic      # Topic-specific

Resources
  GET    /api/resources/:topic     # Recommended resources
  GET    /api/videos/:topic        # Search videos

Accidents
  GET    /api/accidents            # List all
  GET    /api/accidents/:id        # Details
```

[Full API Specification →](docs/PROJECT_PLAN.md#34-api-endpoints-rest)

---

## 🎯 Development Roadmap

### Week-by-Week Timeline

**Phase 1: Foundation (Weeks 1-4)**
- Week 1: Infrastructure setup
- Week 2: Quiz generation
- Week 3: Answer explanations
- Week 4: Progress tracking & Study Assistant
- **✅ Milestone**: MVP complete

**Phase 2: Multimedia (Weeks 5-8)**
- Week 5: YouTube API integration
- Week 6: Video recommendations
- Week 7: Resource library
- Week 8: Enhanced Study Assistant
- **✅ Milestone**: Multimedia platform

**Phase 3: Case Studies (Weeks 9-12)**
- Week 9: Accident database
- Week 10: AI case study generation
- Week 11: Interactive accident study
- Week 12: Scenario-based training
- **✅ Milestone**: Accident library

**Phase 4: Advanced (Weeks 13-16)**
- Week 13: History timeline
- Week 14: AI mentor
- Week 15: Advanced analytics
- Week 16: Polish & launch
- **✅ Milestone**: Production ready

[Detailed Roadmap →](docs/PROJECT_PLAN.md#part-4-development-roadmap)

---

## 🚦 Getting Started

### 1. Choose Development Environment

- **Easiest**: GitHub Codespaces (browser-based)
- **Fastest Setup**: Local (without Docker)
- **Professional**: Docker Compose (full containerization)

### 2. Follow Setup Guide

- [Codespaces Setup](docs/GITHUB_CODESPACES_SETUP.md) (⭐ Recommended for first-time)
- [Local Setup](docs/LOCAL_DEVELOPMENT_SETUP.md) (if Docker unavailable)

### 3. Verify Everything Works

```bash
# Health check endpoints
curl http://localhost:5000/health   # Backend
# Should return: {"status":"healthy","environment":"development"}

# Open frontend
open http://localhost:3000
```

### 4. Start Development

```bash
# Create feature branch
git checkout -b feature/quiz-generator

# Make changes and commit
git add .
git commit -m "feat: Quiz generation for Aerodynamics"
git push origin feature/quiz-generator

# Create Pull Request
# (or use GitHub CLI: gh pr create)
```

---

## 📈 Success Metrics

### Learning Effectiveness
- Quiz average score: >75% after 3 sessions
- Topic mastery rate: >80% in focused areas
- Time to certification readiness: <60 days

### User Engagement
- Daily active users: Track growth
- Quiz generation frequency: >2 per week per user
- Resource utilization: >60% of users accessing videos

### Platform Health
- API response time: <200ms
- Platform uptime: 99.9%
- Error rate: <0.1%

[Full Metrics →](docs/PROJECT_PLAN.md#part-5-success-metrics--kpis)

---

## 🤝 Contributing

### For Team Members

1. **Assign yourself** to a GitHub issue
2. **Create feature branch** from `main`: `git checkout -b feature/your-feature`
3. **Follow code standards**: ESLint, Prettier configured
4. **Write tests** for new code
5. **Create Pull Request** with description
6. **Request review** from team lead

### Code Quality

```bash
# Check code quality
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

---

## 🐛 Troubleshooting

### Common Issues

**Ports already in use?**
```bash
# macOS/Linux
lsof -i :5000  # Find process
kill -9 <PID>  # Kill it

# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

**Database connection failed?**
```bash
# Verify PostgreSQL running
psql -U postgres -d pilotprep_dev -c "SELECT 1"

# Restart PostgreSQL
brew services restart postgresql@15  # macOS
sudo systemctl restart postgresql    # Linux
```

**Services won't start?**
```bash
# Check environment variables
cat backend/.env | head -10

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

[Full Troubleshooting →](docs/LOCAL_DEVELOPMENT_SETUP.md#troubleshooting)

---

## 📞 Support

- **Documentation**: Check `/docs` folder
- **GitHub Issues**: Report bugs or request features
- **Discussions**: General questions and ideas

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎬 Next Steps

1. ✅ Read [PROJECT_PLAN.md](docs/PROJECT_PLAN.md)
2. ✅ Choose dev environment (Codespaces recommended)
3. ✅ Follow setup guide
4. ✅ Verify health check
5. ✅ Create first issue/PR
6. ✅ Start Phase 1 development

---

**Questions?** Start with the [PROJECT_PLAN.md](docs/PROJECT_PLAN.md) - it has everything!

**Ready to contribute?** Check [GITHUB_ISSUES_AND_TASKS.md](docs/GITHUB_ISSUES_AND_TASKS.md) for tasks.

---

## 📊 Project Status Dashboard

```
Phase 1: Foundation (Weeks 1-4)
└─ Week 1: Infrastructure        [ ] Not Started
└─ Week 2: Quiz Engine           [ ] Not Started
└─ Week 3: Explanations          [ ] Not Started
└─ Week 4: Analytics & Assistant [ ] Not Started

Phase 2: Multimedia (Weeks 5-8)
└─ [Not yet started - planned]

Phase 3: Case Studies (Weeks 9-12)
└─ [Not yet started - planned]

Phase 4: Advanced (Weeks 13-16)
└─ [Not yet started - planned]
```

**Start**: Phase 1, Week 1 (Infrastructure)  
**Estimated Completion**: Week 16 (16 weeks from start date)

---

**Built with ❤️ for aviation enthusiasts and aspiring pilots.**
