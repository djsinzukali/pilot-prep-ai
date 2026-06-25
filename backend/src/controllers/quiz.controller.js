const quizService = require('../services/quiz.service');
const explanationService = require('../services/explanation.service');
const explanationRepository = require('../services/explanation.repository');

// GET /api/quiz
const getQuiz = async (req, res) => {
const { category, limit } = req.query;

const questions = await quizService.getQuizQuestions(
category,
limit ? parseInt(limit) : 5
);

res.json(questions);
};

// POST /api/quiz/submit (protected + AI explanations)
const submitQuiz = async (req, res) => {
try {
const { answers } = req.body;


if (!req.user?.userId) {
  return res.status(401).json({
    error: 'Unauthorized'
  });
}

const userId = req.user.userId;

// STEP 1
// Score quiz
const result =
  await quizService.evaluateQuiz(answers);

// STEP 2
// Save quiz attempt
const attemptId =
  await quizService.saveAttempt(
    userId,
    result
  );

// STEP 3
// Generate AI explanations
const explanationResult =
  await explanationService.generateExplanation(
    result.questions,
    answers
  );

// STEP 4
// Save explanations
if (
  explanationResult?.explanations?.length > 0
) {
  await explanationRepository.saveExplanations(
    userId,
    attemptId,
    explanationResult.explanations
  );
}

// STEP 5
// Send response
res.json({
  ...result,
  explanations:
    explanationResult.explanations || []
});


} catch (error) {
console.error(
'QUIZ SUBMIT ERROR:',
error
);


res.status(500).json({
  error: error.message
});


}
};

module.exports = {
getQuiz,
submitQuiz
};
