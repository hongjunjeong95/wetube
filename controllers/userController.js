import passport from "passport";
import routes from "../routes";
import User from "../models/User";

// get방식 join
export const getJoin = (req, res) => {
  console.log(req.body);
  res.render("join", { pageTitle: "Join" });
};

// post방식 join
export const postJoin = async (req, res, next) => {
  // 사용자로부터 입력 값을 받는다.
  const {
    body: { name, email, password, password2 },
  } = req;
  console.log(req.body);
  // verify password
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

// Github Login
export const githubLogin = passport.authenticate("github");

// 이 함수는 사용자가 github에 들어왔을 때 실행이 된다.
export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email },
  } = profile;
  console.log("profile._json : ", profile._json);
  try {
    const user = await User.findOne({ email });
    // console.log("i am github user:" + user.avatarUrl);

    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

// Facebook Login
export const facebookLogin = passport.authenticate("facebook");

// 이 함수는 사용자가 facebook에 들어왔을 때 실행이 된다.
export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postFacebookLogIn = (req, res) => {
  res.redirect(routes.home);
};

export const instagramLogin = passport.authenticate("instagram");

// 이 함수는 사용자가 github에 들어왔을 때 실행이 된다.
export const instagramLoginCallback = async (_, __, profile, cb) => {
  console.log(profile, cb);
  // const {
  //   _json: { id, avatar_url: avatarUrl, name, email },
  // } = profile;
  // try {
  //   const user = await User.findOne({ email });
  //   console.log("i am user:" + user);
  //   if (user) {
  //     user.githubId = id;
  //     user.save();
  //     return cb(null, user);
  //   }
  //   const newUser = await User.create({
  //     email,
  //     name,
  //     githubId: id,
  //     avatarUrl,
  //   });
  //   return cb(null, newUser);
  // } catch (error) {
  //   return cb(error);
  // }
};

export const postInstagramLogIn = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const getMe = (req, res) => {
  res.render("userDetail", { pageTitle: "User Detail", user: req.user });
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    console.log(user);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? `/${file.path}` : `/${req.user.avatarUrl}`,
    });
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(routes.editProfile);
  }
};

// oldPasswod
// newPassword
// newPassword1
export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(`/users/${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`/users/${routes.changePassword}`);
  }
};
