// services/mqttService.js
const mqtt = require('mqtt');
const dotenv = require('dotenv');
dotenv.config();  


// MQTT broker URL (replace with your broker URL)
const client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`);

// Function to connect to the MQTT broker
const connectToBroker = () => {
  client.on('connect', () => {
    console.log('Connected to MQTT broker');
  });

  client.on('error', (err) => {
    console.error('MQTT connection error:', err);
  });
};

// Function to subscribe to a topic
const subscribeToTopic = (topic) => {
  client.subscribe(topic, (err) => {
    if (err) {
      console.error('Error subscribing to topic:', err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });
};

// Function to publish a message to a topic
const publishMessage = (topic, message) => {
  client.publish(topic, message, (err) => {
    if (err) {
      console.error('Error publishing message:', err);
    } else {
      console.log(`Message published to topic: ${topic}`);
    }
  });
};

// Function to handle incoming messages
const onMessage = (callback) => {
  client.on('message', (topic, message) => {
    console.log(`Received message on topic ${topic}:`, message.toString());
    callback(topic, message.toString());
  });
};

module.exports = {
  connectToBroker,
  subscribeToTopic,
  publishMessage,
  onMessage
};
