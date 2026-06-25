const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.register(
      name,
      email,
      password
    );

    res.json(user);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(
      email,
      password
    );

    res.json(result);
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    res.status(401).json({
      error: error.message,
      stack: error.stack
    });
  }
};

module.exports = {
  register,
  login
};