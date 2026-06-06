# Feature Specification: AI Quiz Generator

## Overview
Generates contextually accurate aviation multiple-choice questions across 8 domains with configurable difficulty levels. Questions are cached, validated, and tailored to prevent memorization while maintaining educational accuracy.

---

## User Stories

### Primary User Story
**As a** pilot student preparing for certification  
**I want to** generate practice questions tailored to specific topics and difficulty levels  
**So that** I can assess my knowledge and identify learning gaps efficiently

### Secondary User Stories
- As a flight instructor, I want to generate questions for classroom use
- As a self-taught learner, I want unlimited question variety to study comprehensively
- As a busy professional, I want quick quiz sessions on specific topics

---

## Functional Requirements

### 1. Topic Selection
**Input**: User selects from 8 aviation domains

| Topic | Scope | Examples |
|-------|-------|----------|
| Air Law | Regulations, airspace rules, licensing | FARs, airspace classification, flight rights |
| Meteorology | Weather systems, METAR, TAF | Fronts, turbulence, icing conditions |
| Navigation | Charts, GPS, dead reckoning | Waypoints, magnetic variation, course planning |
| Aircraft Systems | Engines, hydraulics, electrical | Engine operations, fuel systems, electrical failures |
| Aerodynamics | Lift, drag, stalls, turns | CG effects, load factors, stall recovery |
| Flight Planning | Weight & balance, fuel, performance | Runway analysis, takeoff/landing distance |
| Human Factors | Fatigue, decision-making, CRM | Workload management, crew coordination |
| Aviation Safety | Emergency procedures, hazards | Engine failures, system malfunctions, evacuations |

**Technical Implementation**:
- Database enum for 8 topics
- Frontend dropdown/button selector
- Topic validation before API call

### 2. Difficulty Selection
**Input**: User selects from 3 difficulty levels

| Level | Characteristics | Scoring Weight |
|-------|-----------------|-----------------|
| Beginner | Single-concept, direct answers from regs | 1x |
| Intermediate | Application-based, multi-concept reasoning | 1.5x |
| Advanced | Complex scenarios, edge cases, decision-making | 2x |

**Technical Implementation**:
- Difficulty parameter in GPT-4 prompt
- System prompt variation per difficulty
- Difficulty indicator in question metadata

### 3. Question Generation

#### Generation Parameters
```json
{
  "topic": "Aerodynamics",
  "difficulty": "intermediate",
  "question_count": 10,
  "exclude_recent": true,
  "variation_level": 0.8
}
```

#### Question Structure
```json
{
  "id": "uuid",
  "quiz_id": "uuid",
  "topic": "Aerodynamics",
  "difficulty": "intermediate",
  "question_text": "What is the primary reason an aircraft stalls?",
  "options": {
    "a": "Excessive speed",
    "b": "Angle of attack exceeds critical angle",
    "c": "Engine failure",
    "d": "Excessive descent rate"
  },
  "correct_answer": "b",
  "explanation": {
    "correct": "At the critical angle of attack...",
    "a": "Common misconception: speed alone doesn't cause stalls...",
    "b": "N/A",
    "c": "Engine failure may contribute but isn't the definition...",
    "d": "Descent rate is a consequence, not a cause..."
  },
  "generated_at": "2026-06-06T10:30:00Z",
  "cache_key": "aero_intermediate_angle_attack_001"
}
```

### 4. Accuracy & Validation

#### Question Validation
- **Regulatory accuracy**: Compare against FAA AIM/regulations
- **Option clarity**: Verify all options are plausible but distinct
- **Ambiguity check**: Ensure only ONE correct answer
- **Distractor quality**: Check that wrong answers aren't obviously wrong
- **Technical correctness**: Verify aerodynamic/technical principles

#### Validation Pipeline
```
Generated Question
    ↓
[Regex/Syntax Check]
    ↓
[Regulatory Accuracy Check] → Flag if inaccurate
    ↓
[Option Validity Check] → Ensure 4 distinct options
    ↓
[Question Quality Score] → 0-100
    ↓
Quality > 75? → Accept : Regenerate
```

### 5. Caching Strategy

#### Cache Layers
1. **Redis Cache**: Recently generated questions (24-hour TTL)
2. **Database**: All validated questions (permanent)
3. **Generation Prevention**: Don't regenerate same question in 30 days

#### Cache Keys
```
quiz:{topic}:{difficulty}:{seed}
Example: quiz:aerodynamics:intermediate:variation_42
```

#### Cost Optimization
- Cache hit: Serve from Redis (~0.001 API calls)
- Cache miss: Generate via GPT-4 (~0.1 API calls per question)
- Target cache hit rate: >80% to minimize API costs

### 6. Prevention of Memorization

#### Techniques
1. **Seed-based variation**: Same core question, different wording
2. **Option rotation**: Correct answer changes position
3. **Scenario variation**: Same concept, different contexts
4. **Paraphrasing**: Equivalent but differently phrased questions
5. **Time-gating**: Don't repeat questions within 30 days per user

#### Example Variation
```
Original: "What is the primary cause of a spin?"
Variation 1: "A spin develops primarily when..."
Variation 2: "What condition leads to a spin?"
Variation 3: "A spin occurs due to..."
```

---

## Non-Functional Requirements

### Performance
- Generation time: <5 seconds for 10 questions
- Cache hit latency: <100ms
- API timeout: 30 seconds with retry logic

### Scalability
- Support 10,000 concurrent quiz generations
- Generate 1M+ questions monthly
- Maintain cache efficiency at scale

### Reliability
- 99.9% API availability
- Graceful degradation if OpenAI API fails
- Fallback to cached questions

### Security
- Validate user input (no injection attacks)
- Rate limit: 100 quizzes per user per day
- Sanitize explanations for XSS protection

---

## API Endpoints

### POST /api/quizzes
**Generate a new quiz**

Request:
```json
{
  "topic": "Aerodynamics",
  "difficulty": "intermediate",
  "question_count": 10
}
```

Response:
```json
{
  "quiz_id": "uuid",
  "topic": "Aerodynamics",
  "difficulty": "intermediate",
  "questions": [
    {
      "id": "q1",
      "question": "What causes a stall?",
      "options": {"a": "...", "b": "...", "c": "...", "d": "..."},
      "correct_answer": null
    }
  ],
  "created_at": "2026-06-06T10:30:00Z"
}
```

### GET /api/quizzes/:id
**Retrieve quiz details**

Response: Full quiz with explanation metadata (but not answers revealed)

### POST /api/quizzes/:id/submit
**Submit quiz answers**

Request:
```json
{
  "responses": [
    {"question_id": "q1", "selected_answer": "b"},
    {"question_id": "q2", "selected_answer": "a"}
  ]
}
```

Response:
```json
{
  "score": 85,
  "correct_count": 8,
  "total_count": 10,
  "results": [
    {
      "question_id": "q1",
      "correct_answer": "b",
      "selected_answer": "b",
      "is_correct": true,
      "explanation": "..."
    }
  ]
}
```

---

## Database Schema

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  topic VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  question_count INT NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_topic (user_id, topic)
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  topic VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- {"a": "...", "b": "...", "c": "...", "d": "..."}
  correct_answer VARCHAR(1) NOT NULL,
  explanation JSONB NOT NULL,
  cache_key VARCHAR(255),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_cache_key (cache_key),
  INDEX idx_topic_difficulty (topic, difficulty)
);

CREATE TABLE question_cache (
  cache_key VARCHAR(255) PRIMARY KEY,
  question_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '24 hours',
  hit_count INT DEFAULT 0
);
```

---

## System Prompts for GPT-4

### System Prompt Template
```
You are an aviation education expert specializing in {TOPIC}.
Generate a multiple-choice question for {DIFFICULTY} level pilots.

Requirements:
1. Question must be accurate per FAA/ICAO standards
2. Exactly 4 options (a, b, c, d)
3. Only ONE correct answer
4. Incorrect options are plausible but clearly wrong when thinking critically
5. Avoid ambiguity or trick questions
6. Regulatory basis required for all questions

Format your response as JSON:
{
  "question": "...",
  "options": {"a": "...", "b": "...", "c": "...", "d": "..."},
  "correct_answer": "b",
  "regulatory_basis": "FAA...",
  "explanation": {
    "correct": "Why b is correct...",
    "a": "Why a is incorrect...",
    "c": "Why c is incorrect...",
    "d": "Why d is incorrect..."
  }
}
```

### Difficulty Variations
**Beginner**: "Questions should test basic definitions and single concepts from aviation manuals."

**Intermediate**: "Questions should require applying concepts across systems or decision-making scenarios."

**Advanced**: "Questions should present complex multi-system scenarios similar to checkride practical exams."

---

## Implementation Timeline

| Week | Milestone |
|------|-----------|
| 1 | OpenAI integration, basic question generation |
| 2 | Validation engine, caching strategy |
| 3 | API endpoints, database schema |
| 4 | Performance optimization, testing |

---

## Success Criteria

✓ Generate 10 questions in <5 seconds  
✓ >90% question accuracy per expert review  
✓ >80% cache hit rate  
✓ <0.15 API calls per question average (with caching)  
✓ Zero ambiguous questions in validation set  
✓ Support all 8 topics with equal quality  

---

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| GPT-4 generates inaccurate questions | Validation engine, expert review, regulatory source integration |
| High API costs | Aggressive caching, prompt optimization, rate limiting |
| Insufficient option variety | Prompt engineering, seed-based variation |
| User finds same questions repeatedly | 30-day repeat prevention, variation scoring |
