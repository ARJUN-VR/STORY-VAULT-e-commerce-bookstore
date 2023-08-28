const user = require("../model/userSchema");

const login = async (req, res, next) => {
  
  try {
    const userId = req.session.userid;

    if (userId) {
      const userinfo = await user.findOne({ _id: userId });
      const userisblocked = userinfo.is_blocked;

      if (userisblocked) {
        console.log('user blocked');
        return res.redirect("/login");
      } else {
        next();
      }
    } else {
      console.log("User is not logged in"); 
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  login,
};
