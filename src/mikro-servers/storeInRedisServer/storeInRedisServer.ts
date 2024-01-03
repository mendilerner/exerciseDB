import kafka from '../../kafka/kafkaInstance'
import {createClient} from 'redis'
import {  KafkaMessage } from 'kafkajs';
const consumer = kafka.consumer({ groupId: 'storeInRedisGroup' });
const redisClient = createClient({
    url: 'redis://:mendi1234@127.0.0.1:6379'
})

const connectToRedis = async () => {
    try {
      console.log('Trying to connect to Redis...');
      await redisClient.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Error connecting to Redis:', error);
    }
  };

const processMessage = async ( message : KafkaMessage) => {
    try {
        if (message.value === null) 
        {
            console.log('the massage is null');
            return
        }       
      const { source, missileAmount, destination, requestTime } = JSON.parse(message.value.toString());
      console.log(
        source, missileAmount, destination, requestTime
      );
      
      const existKey = await redisClient.exists(`country{${source}}:dist{${destination}}`);
      if (!existKey) {
          await redisClient.json.set(`country{${source}}:dist{${destination}}`, '$', {
              "Rounds": 1,
              "missileAmount": missileAmount,
              creationTime: requestTime,
              lastUpdateTime: requestTime,
          })
      }
      else{
          await redisClient.multi()
          .json.numIncrBy(`country{${source}}:dist{${destination}}`, '$.Rounds', 1)
          .json.numIncrBy(`country{${source}}:dist{${destination}}`, '$.missileAmount', missileAmount)
          .json.merge(`country{${source}}:dist{${destination}}`, '$.lastUpdateTime', requestTime)
          .exec(true)
      }
    
      console.log(`Data for ${source} updated successfully.`);
    } catch (error) {
      console.error(`Error processing message: ${error}`);
    }
  };

const runConsumer = async () => {
    await connectToRedis()
    await consumer.subscribe({ topic: 'missileDataPSI' });
    await consumer.run({
      eachMessage: async ({ message }) => {
        await processMessage(message);
      }
    });

  };

runConsumer()
  