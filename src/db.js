import mongoose from 'mongoose';
import dotenv from 'dotenv';
import './models/Video';

// .env 파일 안에 있는 정보를 불러올 수 있다.
dotenv.config();

mongoose.connect(
  process.env.PRODUCTION ? process.env.MONGO_URL_ATLAS : process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

const handleOpen = () => console.log('✅ Connected to DB');
const handleError = (error) =>
  console.log(`❌ Error on DB Connection:${error}`);

db.once('open', handleOpen);
db.on('error', handleError);
