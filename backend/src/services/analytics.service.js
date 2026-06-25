const pool = require('../db');

const getUserStats = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      COUNT(*) as quizzes_taken,
      AVG(score) as avg_score,
      AVG(percentage) as avg_percentage
    FROM quiz_attempts
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
};

const getWeakAreas = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      q.category,
      COUNT(*) AS mistakes
    FROM quiz_attempts qa
    JOIN LATERAL jsonb_array_elements(qa.feedback) f ON true
    JOIN questions q
      ON q.id = (f->>'questionId')::int
    WHERE qa.user_id = $1
      AND (f->>'isCorrect')::boolean = false
    GROUP BY q.category
    ORDER BY mistakes DESC
    `,
    [userId]
  );

  return result.rows;
};

const getRecommendationData = async (userId) => {
  const stats = await getUserStats(userId);

  const weakAreas = await getWeakAreas(userId);

  return {
    stats,
    weakAreas
  };
};

const getProgress = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      percentage,
      created_at
    FROM quiz_attempts
    WHERE user_id = $1
    ORDER BY created_at ASC
    `,
    [userId]
  );

  return result.rows;
};

module.exports = {
  getUserStats,
  getWeakAreas,
  getRecommendationData,
  getProgress
};