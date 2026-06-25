const express = require('express');
const router = express.Router();

const authMiddleware =
  require('../middleware/auth.middleware');

const analyticsController =
  require('../controllers/analytics.controller');

router.get(
  '/me',
  authMiddleware,
  analyticsController.getMyStats
);

router.get(
  '/weak-areas',
  authMiddleware,
  analyticsController.getWeakAreas
);

router.get(
  '/recommendations',
  authMiddleware,
  analyticsController.getRecommendations
);

router.get(
  '/progress',
  authMiddleware,
  analyticsController.getProgress
);

module.exports = router;