const userService = require('../services/userService');
const { publishEvent } = require('../services/eventBus');
const { getCache, setCache } = require('../services/cacheService');

exports.getUsers = async (req, res) => {
  try {
    const cacheKey = 'users';
    const cachedUsers = await getCache(cacheKey);

    if (cachedUsers) {
      return res.json(cachedUsers);
    }

    const users = await userService.getUsers();
    res.json(users);
    publishEvent('usersFetched', JSON.stringify(users));
    setCache(cacheKey, users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const cacheKey = `user:${userId}`;
    const cachedUser = await getCache(cacheKey);

    if (cachedUser) {
      return res.json(cachedUser);
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
    publishEvent('userFetched', JSON.stringify(user));
    setCache(cacheKey, user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
