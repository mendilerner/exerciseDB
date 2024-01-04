import {Kafka} from 'kafkajs'
import dotenv from 'dotenv';
dotenv.config()

const brokerHost = process.env.BROKER_HOST || "no host provided"
if (brokerHost === 'no host provided') {
    console.log('broker host is not defined in .env file');
}
else{
  console.log(brokerHost);
}
// Initialize Kafka producer
const kafka = new Kafka({
  clientId: 'MkU3OEVBNTcwNTJENDM2QkACAC',
  brokers: ['localhost:9092'] // Replace with your Kafka broker(s)
});

export default kafka