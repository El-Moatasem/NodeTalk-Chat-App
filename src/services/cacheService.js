// src/services/cacheService.js
const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

const getCache = async (key) => {
  const data = await getAsync(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key, value, expiration = 3600) => {
  await setAsync(key, JSON.stringify(value), 'EX', expiration);
};

const delCache = async (key) => {
  await delAsync(key);
};

module.exports = {
  getCache,
  setCache,
  delCache,
};
