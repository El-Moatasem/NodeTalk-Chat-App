const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis error:', err);
});

const getCache = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) return reject(err);
      if (data) return resolve(JSON.parse(data));
      resolve(null);
    });
  });
};

const setCache = (key, value, expireTime = 3600) => {
  client.setex(key, expireTime, JSON.stringify(value));
};

const delCache = (key) => {
  client.del(key);
};

module.exports = {
  getCache,
  setCache,
  delCache,
};
