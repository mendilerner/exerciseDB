import axios from 'axios';
import {Kafka, logLevel} from 'kafkajs'
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
  clientId: 'MkU3OEVBNTcwNTJENDM2Qk',
  brokers: [brokerHost] // Replace with your Kafka broker(s)
});

const producer = kafka.producer();

async function sendRequestAndProduceData() {
  try {
    const response = await axios.get('http://localhost:5002/getData');
    
    const now = new Date();
    const options = { timeZone: 'Asia/Jerusalem' };
    const israelTimeISOString = now.toLocaleString('en-US', options);

    // Prepare data to be sent to Kafka
    const dataToSend = {
      ...response.data,
      requestTime: israelTimeISOString
    };

    // Produce the data to Kafka topic
    await producer.send({
      topic: 'missileDataPSI',
      messages: [
        { value: JSON.stringify(dataToSend) }
      ]
    });

    console.log(`Data sent to Kafka at ${israelTimeISOString}`);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}


async function runProducer() {
  await producer.connect();

  await sendRequestAndProduceData();

  setInterval(sendRequestAndProduceData, 15000);
}


runProducer().catch(console.error);
