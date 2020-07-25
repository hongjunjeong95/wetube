import express from "express";

import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import { localsMiddleware } from "./middlewares";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";

import "./passport";

// express를 import하고 const app에 저장한다.
const app = express();
const CookieStore = MongoStore(session);

// helmet은 application을 보다 더 안전하게 만들어준다.
app.use(helmet());

// view engine을 위한 pug 설정
app.set("view engine", "pug");

// express.static("uploads")는 directory에서 file을 보내주는
// middleware다. 주어진 directory에서 file을 전달하는
// 새로운 middleware function이다. 따라서 어떤 종류의 controller나 view같은
// 것은 확인하지 않고 file만 확인한다.
// * 하지만 static file을 사용하는 것은 좋지 않다.
// user가 생성하는 파일들은 server와 분리되어야 한다.
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

// app을 이용해서 middleware를 추가해준다.
// cookieParser는 사용자 인증에 필요한 cookie를 전달 받는다.
app.use(cookieParser());

// bodyParser는 사용자가 웹사이트로 전달하는 정보들(request 정보에서)
// form이나 JSON 형태로 된 body를 검사한다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// margan은 application에서 발생하는 모든 일을 기록한다.
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({ mongooseConnection: mongoose.connection }),
  })
);

// express-session을 설치해주자.
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // connect session

app.use(localsMiddleware);

// 3개의 router를 사용했다.
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;
