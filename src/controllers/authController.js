// src/controllers/authController.js
const authService = require('../services/authService');
const { publishEvent } = require('../services/eventBus');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { user, token } = await authService.register(username, email, password);
    res.status(201).json({ message: 'User registered', user, token });
    publishEvent('userRegistered', JSON.stringify({ user, token }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
    publishEvent('userLoggedIn', JSON.stringify({ user, token }));
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  const response = authService.logout();
  res.json(response);
  publishEvent('userLoggedOut', JSON.stringify(response));
};
