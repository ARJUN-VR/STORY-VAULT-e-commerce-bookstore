const login = async (req, res, next) => {
  try {
    if (req.session.userisblocked == 1) {
      res.render("login", { message: "you have no access" });
      console.log("user have no access");
    } else if (req.session.userisblocked == 0) {
      console.log("user is not blocked");
      next();
    } else if (req.session.userEmail) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  login,
};
