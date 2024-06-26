// src/controllers/userController.js
const userService = require('../services/userService');
const { publishEvent } = require('../services/eventBus');

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    console.log("users: ", users)
    res.json(users);
    publishEvent('usersFetched', JSON.stringify(users));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
    publishEvent('userFetched', JSON.stringify(user));
  } catch (error) {
    res.status (500).json({ error: error.message });
  }
};
