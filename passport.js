import passport from "passport";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
// import InstagramStrategy from "passport-instagram";
import User from "./models/User";
import {
  githubLoginCallback,
  // instagramLoginCallback,
  facebookLoginCallback,
} from "./controllers/userController";
import routes from "./routes";

// passport-local-mongoose가 제공하는 LocalStrategy()를
// 한 줄로 제공하는 API다.
passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: `http://localhost:4000${routes.githubCallback}`,
    },
    githubLoginCallback
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: `https://afraid-baboon-46.localtunnel.me${routes.facebookCallback}`,
      profileFields: ["id", "displayName", "photos", "email"],
      scope: ["public_profile", "email"],
    },
    facebookLoginCallback
  )
);

// passport.use(
//   new InstagramStrategy(
//     {
//       clientID: process.env.INSTAGRAM_ID,
//       clientSecret: process.env.INSTAGRAM_SECRET,
//       callbackURL: `http://localhost:4000${routes.instagramCallback}`,
//     },
//     instagramLoginCallback
//   )
// );

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
