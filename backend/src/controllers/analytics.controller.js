const analyticsService = require('../services/analytics.service');
const recommendationService = require('../services/recommendation.service');

const getMyStats = async (req, res) => {
  try {
    const stats = await analyticsService.getUserStats(
      req.user.userId
    );

    res.json(stats);

  } catch (error) {
    console.error('ANALYTICS ERROR:', error);

    res.status(500).json({
      error: error.message
    });
  }
};

const getWeakAreas = async (req, res) => {
  try {
    const weakAreas = await analyticsService.getWeakAreas(
      req.user.userId
    );

    res.json({
      weakAreas
    });

  } catch (error) {
    console.error('WEAK AREAS ERROR:', error);

    res.status(500).json({
      error: error.message
    });
  }
};

const getRecommendations = async (
  req,
  res
) => {
  try {
    const data =
      await analyticsService.getRecommendationData(
        req.user.userId
      );

    const recommendation =
      await recommendationService
        .generateRecommendation(data);

    res.json(recommendation);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const getProgress = async (req, res) => {
  try {
    const progress =
      await analyticsService.getProgress(
        req.user.userId
      );

    res.json({
      progress
    });

  } catch (error) {
    console.error(
      'PROGRESS ERROR:',
      error
    );

    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  getMyStats,
  getWeakAreas,
  getRecommendations,
  getProgress
};