import '@babel/polyfill';
import './db';
import dotenv from 'dotenv';
import app from './app';
import './models/Video';
import './models/Comment';
import './models/User';

// .env 파일 안에 있는 정보를 불러올 수 있다.
dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✅ Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
