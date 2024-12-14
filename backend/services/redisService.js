// services/redisService.js
const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

// Create a Redis client (you may need to adjust the host and port depending on your setup)
const client = redis.createClient({ host: process.env.REDIS_HOST, port: 6379 });

// Function to connect to Redis
client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Function to set a key-value pair in Redis
const setCache = (key, value, expiration = 3600) => {
  client.setex(key, expiration, value, (err, reply) => {
    if (err) {
      console.error('Error setting cache:', err);
    } else {
      console.log(`Cache set: ${key} => ${value}`);
    }
  });
};

// Function to get a value from Redis by key
const getCache = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        reject('Error retrieving cache:', err);
      } else {
        resolve(reply);
      }
    });
  });
};

// Function to delete a key from Redis
const deleteCache = (key) => {
  client.del(key, (err, reply) => {
    if (err) {
      console.error('Error deleting cache:', err);
    } else {
      console.log(`Cache deleted: ${key}`);
    }
  });
};

module.exports = {
  setCache,
  getCache,
  deleteCache
};
