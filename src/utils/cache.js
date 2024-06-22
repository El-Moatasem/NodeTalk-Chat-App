// src/utils/cache.js
const redis = require('redis');
const client = redis.createClient();

const getFromCache = (key) => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

const setToCache = (key, value, expiry = 3600) => {
    client.set(key, value, 'EX', expiry);
};

module.exports = {
    getFromCache,
    setToCache
};
