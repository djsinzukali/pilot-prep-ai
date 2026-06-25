const express = require('express');
const router = express.Router();

const quizController = require('../controllers/quiz.controller');
const authMiddleware = require('../middleware/auth.middleware');

// GET quiz questions
router.get('/', quizController.getQuiz);

// Submit quiz answers (protected)
router.post('/submit', authMiddleware, quizController.submitQuiz);

module.exports = router;