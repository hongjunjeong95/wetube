import routes from "../routes";
import User from "../models/User";

//get방식 join
export const getJoin = (req, res) => {
  console.log(req.body);
  res.render("join", { pageTitle: "Join" });
};

//post방식 join
export const postJoin = async (req, res) => {
  //사용자로부터 입력 값을 받는다.
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
    } catch (error) {
      console.log(error);
    }

    // To Do: Log user in
    res.redirect(routes.home);
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  // To Do: Process Log Out
  res.redirect(routes.home);
};

export const userDetail = (req, res) =>
  res.render("userDetail", { pageTitle: "User Detail" });

export const editProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const changePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });
