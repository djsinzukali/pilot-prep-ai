const pool = require('../db');

const saveExplanations = async (
  userId,
  quizAttemptId,
  explanations
) => {
  const queries = explanations.map((ex) =>
    pool.query(
      `INSERT INTO quiz_explanations
      (
        user_id,
        quiz_attempt_id,
        question_id,
        correct_explanation,
        wrong_explanation,
        takeaway,
        error_type
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        userId,
        quizAttemptId,
        ex.questionId,
        ex.correctExplanation,
        ex.wrongExplanation,
        ex.takeaway,
        ex.errorType || 'unknown'
      ]
    )
  );

  await Promise.all(queries);
};

module.exports = {
  saveExplanations
};