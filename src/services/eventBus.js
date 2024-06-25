const redis = require('redis');
const pub = redis.createClient();
const sub = redis.createClient();

// Subscribe to events and handle messages
sub.on('message', (channel, message) => {
    console.log(`Received message from ${channel}: ${message}`);
    // Here you can handle the message based on the channel
    // For example, you might route the message to a specific function or service
});

// Function to publish an event to a channel
const publishEvent = (channel, message) => {
    pub.publish(channel, message, (err, reply) => {
        if (err) {
            console.error(`Failed to publish event to ${channel}:`, err);
        } else {
            console.log(`Event published to ${channel}:`, reply);
        }
    });
};

// Function to subscribe to a channel
const subscribeToEvent = (channel) => {
    sub.subscribe(channel, (err, reply) => {
        if (err) {
            console.error(`Failed to subscribe to ${channel}:`, err);
        } else {
            console.log(`Subscribed to ${channel}:`, reply);
        }
    });
};

module.exports = {
    publishEvent,
    subscribeToEvent
};
