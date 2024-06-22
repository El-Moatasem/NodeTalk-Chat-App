// src/services/eventBus.js
const redis = require('redis');
const pub = redis.createClient();
const sub = redis.createClient();

sub.on('message', (channel, message) => {
    console.log(`Received message from ${channel}: ${message}`);
    // Handle the message based on channel
});

const publishEvent = (channel, message) => {
    pub.publish(channel, message);
};

const subscribeToEvent = (channel) => {
    sub.subscribe(channel);
};

module.exports = {
    publishEvent,
    subscribeToEvent
};
