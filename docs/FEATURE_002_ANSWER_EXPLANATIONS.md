# Feature Specification: AI Answer Explanations

## Overview
Provides comprehensive educational explanations for quiz answers, teaching users not just what the correct answer is, but **why** it's correct and why alternatives are incorrect. Explanations are grounded in FAA/ICAO regulations with practical aviation context.

---

## User Stories

### Primary User Story
**As a** student who answered incorrectly  
**I want to** understand not just the right answer but the underlying concept I misunderstood  
**So that** I can correct my understanding and improve on similar future questions

### Secondary User Stories
- As a student who answered correctly, I want to verify my reasoning was sound
- As a flight instructor, I want explanations suitable for teaching students
- As a self-learner, I want to deepen my aviation knowledge beyond memorization

---

## Functional Requirements

### 1. Explanation Components

Each quiz question includes multi-layered explanations:

#### 1.1 Correct Answer Explanation
```json
{
  "answer_text": "Angle of attack exceeds critical angle",
  "why_correct": "A stall occurs aerodynamically when the wing's angle of attack exceeds the critical angle, causing separation of airflow and loss of lift.",
  "regulatory_basis": "FAA-H-8083-3B (Airplane Flying Handbook), Chapter 4: Aerodynamics",
  "technical_principles": [
    "Boundary layer separation reduces pressure differential",
    "Lift coefficient decreases beyond critical angle",
    "Loss of lift causes descent regardless of airspeed"
  ],
  "practical_context": "Pilots recover from stalls by reducing angle of attack through forward elevator pressure, not by adding power alone.",
  "sources": [
    "FAA AIM Section 4.3.2 - Stall Recovery",
    "AC 61-67C - Stall and Spin Awareness Training"
  ]
}
```

#### 1.2 Incorrect Option Analysis
For each wrong answer:
```json
{
  "option": "Excessive speed",
  "answer_text": "High airspeed causes stalls",
  "common_misconception": "Many students believe speed prevents stalls, but speed alone doesn't cause or prevent them.",
  "why_incorrect": "A stall is an aerodynamic condition (loss of lift) determined by angle of attack, not airspeed. An aircraft can stall at any speed if the angle of attack becomes excessive.",
  "correct_concept": "An aircraft can stall at low speed (landing approach) or high speed (steep dive recovery). Speed is not the determining factor.",
  "learning_point": "Understand the difference between airspeed and angle of attack—two independent concepts.",
  "related_concept": "This confusion often comes from confusing 'stall' with 'overspeed' conditions."
}
```

#### 1.3 Learning Notes
```json
{
  "key_takeaway": "Stalls are determined by angle of attack, not airspeed. Prevention requires maintaining angle of attack below critical value.",
  "memory_aids": [
    "AOA (Angle of Attack) determines stall, not speed",
    "Critical AOA = ~15-20° for most aircraft (varies)",
    "Stall warning triggers ~5-10° before actual stall"
  ],
  "real_world_application": "In a crosswind landing approach at low speed, angle of attack increases; pilots must reduce pitch to prevent stall regardless of airspeed.",
  "cross_topic_links": [
    {"topic": "Flight Planning", "link": "Weight and balance affects critical AOA"},
    {"topic": "Aerodynamics", "link": "Boundary layer separation physics"},
    {"topic": "Aircraft Systems", "link": "Stall warning systems"}
  ]
}
```

### 2. Explanation Accuracy & Validation

#### Regulatory Source Verification
- Questions citing FAA regulations must link to specific AIM sections
- ICAO references must cite specific Annexes
- Technical explanations verified against FAA handbooks

#### Accuracy Checklist
```
✓ All regulatory citations are accurate and current
✓ Technical explanations align with aerodynamic principles
✓ No contradictions between correct and incorrect explanations
✓ Difficulty level matches explanation depth
✓ Real-world context is accurate and relatable
✓ Memory aids are mnemonically sound
```

#### Expert Review Protocol
- Phase 1: AI generates explanation
- Phase 2: Automated validation against FAA database
- Phase 3: Human expert review (Certified Flight Instructor)
- Phase 4: Publish and track user feedback

### 3. Explanation Generation

#### Generation Pipeline
```
Question + Options
    ↓
[Generate Correct Answer Explanation]
    ↓
[Generate Incorrect Option Analysis (x3)]
    ↓
[Generate Learning Notes & Memory Aids]
    ↓
[Cross-Link to Related Topics]
    ↓
[Regulatory Source Integration]
    ↓
[Validation & Fact-Check]
    ↓
Publish or Flag for Expert Review
```

#### System Prompt for Explanation Generation
```
You are an aviation education expert and certified flight instructor.
Generate comprehensive educational explanations for aviation quiz questions.

For the CORRECT answer:
1. Explain the aerodynamic/regulatory principle
2. Cite specific FAA/ICAO regulations
3. Explain practical pilot application
4. Use clear, non-technical language for students

For INCORRECT options:
1. Identify the common misconception
2. Explain why this reasoning is flawed
3. Provide the correct concept
4. Link to related learning

Format as JSON with these fields:
- answer_text
- why_correct
- regulatory_basis
- technical_principles (array)
- practical_context
- sources (array)
- misconceptions (array)
- learning_notes
- memory_aids
- cross_topic_links
```

### 4. Difficulty-Appropriate Explanations

Explanations scale with question difficulty:

| Difficulty | Explanation Style | Depth | Regulatory Detail |
|------------|-------------------|-------|-------------------|
| Beginner | Simple, conversational | Shallow | General (AIM section) |
| Intermediate | Detailed, technical | Moderate | Specific (regulation number) |
| Advanced | Complex scenarios, edge cases | Deep | Comprehensive (multiple regulations, exceptions) |

**Example - Same Concept, Different Depths**

Beginner:
```
"A stall happens when the wing can't produce enough lift. 
Lift depends on angle of attack. If the angle gets too steep, 
the wing stalls. That's why we keep angle of attack reasonable."
```

Intermediate:
```
"A stall occurs when angle of attack exceeds the critical angle (typically 15-20°), 
causing boundary layer separation over the wing. This reduces the pressure differential 
that generates lift. Per FAA-H-8083-3B Chapter 4, pilots recover by reducing pitch 
to decrease angle of attack below critical."
```

Advanced:
```
"At the critical angle of attack, adverse pressure gradient exceeds the boundary 
layer's ability to remain attached. Separation initiates flow reversal; lift coefficient 
drops precipitously (typically from 1.5 to 0.3 in 2-3°). Recovery requires pitch reduction 
sufficient to decrease AOA below ~12°, per AC 61-67C. Consider that density altitude and 
weight distribution affect both critical AOA and stall warning accuracy—high-altitude 
stalls often develop with reduced buffeting cues."
```

### 5. Cross-Topic Linking

Explanations link related concepts:

```json
{
  "cross_topic_links": [
    {
      "topic": "Aerodynamics",
      "concept": "Boundary Layer Separation",
      "link_text": "Learn more about boundary layer physics"
    },
    {
      "topic": "Aircraft Systems",
      "concept": "Stall Warning Systems",
      "link_text": "How do stall warning systems work?"
    },
    {
      "topic": "Flight Planning",
      "concept": "Weight & Balance Effects",
      "link_text": "How does CG position affect stall characteristics?"
    }
  ]
}
```

### 6. Source Citations

Explanations cite authoritative sources:

```json
{
  "sources": [
    {
      "type": "FAA Handbook",
      "title": "Airplane Flying Handbook",
      "document": "FAA-H-8083-3B",
      "section": "Chapter 4: Aerodynamics",
      "url": "https://www.faa.gov/regulations_policies/handbooks_manuals/"
    },
    {
      "type": "Advisory Circular",
      "title": "Stall and Spin Awareness Training",
      "document": "AC 61-67C",
      "url": "https://www.faa.gov/regulations_policies/advisory_circulars/"
    },
    {
      "type": "Regulation",
      "title": "14 CFR Part 61.407",
      "section": "Stall and spin training requirements",
      "url": "https://www.ecfr.gov/"
    }
  ]
}
```

---

## API Endpoints

### GET /api/quizzes/:id/questions/:question_id
**Retrieve question with explanation (before answer revealed)**

Response:
```json
{
  "question_id": "q1",
  "question_text": "What causes a stall?",
  "options": {"a": "...", "b": "...", "c": "...", "d": "..."},
  "correct_answer": null,
  "explanation": null
}
```

### POST /api/quizzes/:id/submit
**Submit answer and receive explanation**

Request:
```json
{
  "question_id": "q1",
  "selected_answer": "b"
}
```

Response:
```json
{
  "question_id": "q1",
  "selected_answer": "b",
  "correct_answer": "b",
  "is_correct": true,
  "explanation": {
    "answer_text": "Angle of attack exceeds critical angle",
    "correct": {
      "why_correct": "...",
      "regulatory_basis": "FAA-H-8083-3B Chapter 4",
      "technical_principles": [...],
      "practical_context": "..."
    },
    "incorrect_options": [
      {
        "option": "a",
        "why_incorrect": "...",
        "misconception": "...",
        "correct_concept": "..."
      }
    ],
    "learning_notes": {
      "key_takeaway": "...",
      "memory_aids": [...],
      "cross_topic_links": [...]
    },
    "sources": [...]
  }
}
```

### GET /api/explanations/by-topic/:topic
**Retrieve all explanations for a topic (for study/reference)**

Response: Array of all questions with full explanations for a topic

---

## Database Schema

```sql
CREATE TABLE explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  correct_explanation JSONB NOT NULL,
  incorrect_explanations JSONB NOT NULL, -- Array of explanations for options a,b,c,d
  learning_notes JSONB NOT NULL,
  cross_topic_links JSONB,
  sources JSONB NOT NULL,
  validated BOOLEAN DEFAULT false,
  expert_reviewed BOOLEAN DEFAULT false,
  expert_reviewer_id UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_question_id (question_id),
  INDEX idx_validated (validated)
);

CREATE TABLE explanation_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  explanation_id UUID NOT NULL REFERENCES explanations(id) ON DELETE CASCADE,
  source_type VARCHAR(50), -- FAA Handbook, Advisory Circular, Regulation, etc.
  source_title VARCHAR(255),
  document_id VARCHAR(100), -- e.g., FAA-H-8083-3B, AC 61-67C
  section VARCHAR(255),
  url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Content Standards

### For All Explanations
✓ Accurate per FAA/ICAO standards  
✓ Clear, jargon-free language (suitable for students)  
✓ Minimum 2 regulatory sources  
✓ Real-world aviation context  
✓ No contradictions or ambiguities  

### For Beginner Explanations
✓ 2-3 sentences max per section  
✓ Concrete examples  
✓ Avoid advanced aerodynamics  

### For Intermediate Explanations
✓ 4-5 sentences per section  
✓ Technical depth with accessibility  
✓ Cross-topic references  

### For Advanced Explanations
✓ Comprehensive technical detail  
✓ Edge cases and nuances  
✓ Regulatory requirements  
✓ Complex decision-making scenarios  

---

## Implementation Timeline

| Week | Milestone |
|------|-----------|
| 3 | Explanation generation prompts, source integration |
| 3-4 | Explanation validation engine, expert review process |
| 4 | API endpoints, database schema |

---

## Success Criteria

✓ 100% of explanations have regulatory sources  
✓ >95% accuracy rate after expert review  
✓ Explanations match difficulty level of questions  
✓ Average explanation helpfulness score: >4.5/5 from users  
✓ Cross-topic links functional for >80% of questions  
✓ No grammatical errors or unclear language  

---

## Quality Assurance

### Automated Validation
- Source URL verification (no dead links)
- Regulatory accuracy checking
- Spelling/grammar check
- Format validation (JSON structure)

### Expert Review
- Certified Flight Instructors review all Phase 1 explanations
- Focus on accuracy, clarity, practical applicability
- Flag any inaccuracies for regeneration

### User Feedback Loop
- Users rate explanation helpfulness (1-5 stars)
- Track which explanations have low ratings
- Flag for expert review if rating <3
- Continuous improvement through feedback

---

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| LLM generates inaccurate explanations | Expert review, regulatory source validation, automated fact-checking |
| Explanations too technical for beginners | Difficulty-scaled generation, user feedback loop |
| Source links go stale | Regular URL verification, backup archive |
| Users find explanations unhelpful | Feedback mechanism, continuous retraining |
