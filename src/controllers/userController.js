import passport from 'passport';
import routes from '../routes';
import User from '../models/User';

// get방식 join
export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};

// post방식 join
export const postJoin = async (req, res, next) => {
  // 사용자로부터 입력 값을 받는다.
  const {
    body: { name, email, password, password2 },
  } = req;
  // verify password
  if (password !== password2) {
    req.flash('error', "Passwords don't match");
    res.status(400);
    res.render('join', { pageTitle: 'Join' });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      console.log('post user:', user);
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render('login', { pageTitle: 'Log In' });

export const postLogin = passport.authenticate('local', {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: 'Welcome',
  failureFlash: "Can't log in. Check email and/or password",
});

// Github Login
export const githubLogin = passport.authenticate('github', {
  successFlash: 'Welcome',
  failureFlash: "Can't log in at this time",
});

// 이 함수는 사용자가 github에 들어왔을 때 실행이 된다.
export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
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
export const facebookLogin = passport.authenticate('facebook', {
  successFlash: 'Welcome',
  failureFlash: "Can't log in at this time",
});

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

export const logout = (req, res) => {
  req.flash('info', 'Logged out, see you later');
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  const {
    user: { id },
  } = req;
  try {
    const user = await User.findById(id).populate('videos');
    res.render('userDetail', { pageTitle: 'User Detail', user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id).populate('videos');
    res.render('userDetail', { pageTitle: 'User Detail', user });
  } catch (error) {
    req.flash('error', 'User not found');
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) =>
  res.render('editProfile', { pageTitle: 'Edit Profile' });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
    user: { id },
  } = req;
  try {
    await User.findByIdAndUpdate(id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    req.flash('success', 'Profile updated');
    res.redirect(routes.me);
  } catch (error) {
    req.flash('error', "Can't update profile");
    res.redirect(routes.editProfile);
  }
};

// oldPasswod
// newPassword
// newPassword1
export const getChangePassword = (req, res) =>
  res.render('changePassword', { pageTitle: 'Change Password' });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash('error', "Passwords don't match");
      res.status(400);
      res.redirect(`/users/${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    req.flash('error', "Can't change password");
    res.status(400);
    res.redirect(`/users/${routes.changePassword}`);
  }
};
