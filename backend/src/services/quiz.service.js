const pool = require('../db');

// Get questions (with optional category filter)
const getQuizQuestions = async (category, limit = 5) => {
  let query =
    'SELECT id, question, options, answer, category, difficulty FROM questions';

  let params = [];

  if (category) {
    query += ' WHERE category = $1';
    params.push(category);
  }

  query += ' ORDER BY RANDOM()';

  if (limit) {
    query += category ? ' LIMIT $2' : ' LIMIT $1';
    params.push(limit);
  }

  const result = await pool.query(query, params);

  return result.rows;
};

// Evaluate quiz answers
const evaluateQuiz = async (answers) => {
  const result = await pool.query(
    `SELECT
      id,
      question,
      options,
      answer
     FROM questions`
  );

  let score = 0;
  let feedback = [];

  result.rows.forEach((q) => {
    const userAnswer = answers?.[q.id];

    const isCorrect = userAnswer === q.answer;

    if (isCorrect) score++;

    feedback.push({
      questionId: q.id,
      correct: q.answer,
      userAnswer: userAnswer || null,
      isCorrect
    });
  });

  const total = result.rows.length;

  return {
    totalQuestions: total,
    score,
    percentage: total === 0
      ? 0
      : (score / total) * 100,
    feedback,

    // Gemini will need this
    questions: result.rows
  };
};

// Save attempt and return ID
const saveAttempt = async (userId, result) => {
  const dbResult = await pool.query(
    `INSERT INTO quiz_attempts
    (
      user_id,
      score,
      total,
      percentage,
      feedback
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`,
    [
      userId,
      result.score,
      result.totalQuestions,
      result.percentage,
      JSON.stringify(result.feedback)
    ]
  );

  const attemptId = dbResult.rows[0].id;

  console.log('ATTEMPT ID:', attemptId);

  return attemptId;
};

module.exports = {
  getQuizQuestions,
  evaluateQuiz,
  saveAttempt
};