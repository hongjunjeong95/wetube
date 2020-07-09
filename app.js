import express from "express";

import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";

//express를 import하고 const app에 저장한다.
const app = express();

// view engine을 위한 pug 설정
app.set("view engine", "pug");

//app을 이용해서 middleware를 추가해준다.
//cookieParser는 사용자 인증에 필요한 cookie를 전달 받는다.
app.use(cookieParser());

//bodyParser는 사용자가 웹사이트로 전달하는 정보들(request 정보에서
//form이나 JSON 형태로 된 body를 검사한다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//helmet은 application을 보다 더 안전하게 만들어준다.
app.use(helmet());

//margan은 application에서 발생하는 모든 일을 기록한다.
app.use(morgan("dev"));

//3개의 router를 사용했다.
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
