import cors, { CorsOptions } from "cors";
import dotenv from 'dotenv'
dotenv.config()
const appDomain = process.env.HOST_FOR_CORS
let whiteList
if (appDomain){ 
  whiteList = [appDomain,];
} 
else if (process.env.NODE_ENV === 'dev'){
  whiteList = [
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
  ];
}
else{
  console.log('you need to set host for cors');
}

const corsOptions: CorsOptions = {
  origin: whiteList,
};

const corsHandler = cors(corsOptions);

export default corsHandler;
