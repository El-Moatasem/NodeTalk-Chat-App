// src/services/userService.js
const User = require('../models/user');

const getUsers = async () => {
  return await User.find({}, 'username'); // Adjust the fields you want to return
};

const getUserById = async (id) => {
  return await User.findById(id, 'username'); // Adjust the fields you want to return
};

module.exports = {
  getUsers,
  getUserById
};
