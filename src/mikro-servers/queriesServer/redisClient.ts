import { createClient } from "redis";

export const redisClient = createClient({
    url: 'redis://:mendi1234@127.0.0.1:6379'
})

export const connectToRedis = async () => {
    try {
      console.log('Trying to connect to Redis...');
      await redisClient.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Error connecting to Redis:', error);
    }
  };