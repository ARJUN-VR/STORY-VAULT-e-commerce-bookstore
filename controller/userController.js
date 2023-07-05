const User = require("../model/userSchema");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error);
  }
};

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
};

const insertUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phone: "+91" + req.body.no,
      password: spassword,
      is_blocked: 0,
    });
    const userdata = await user.save();
    if (userdata) {
      res.render("registration", { message: "registration success" });
    } else {
      res.render("registration", { message: "registration failed" });
    }
  } catch (error) {
    console.log(error);
  }
};
const verify = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userdata = await User.findOne({ email: email });

    if (userdata) {
      const passwordMatch = await bcrypt.compare(password, userdata.password);
      if (passwordMatch) {
        req.session.userEmail = userdata.email;
        req.session.userisblocked=userdata.is_blocked

        res.redirect("/home");
      } else {
        res.render("login", { message: "incorrect password" });
      }
    } else {
      res.render("login", { message: "incorrect email" });
    }
  } catch (error) {
    console.log(error);
  }
};
const loadOtp = async (req, res) => {
  try {
    res.render("otp");
  } catch (error) {
    console.log(error);
  }
};

const loadHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error);
  }
};
const phoneVerify = async (req, res) => {
  try {
    const phone = req.body.ph;
    const userPhone = await User.findOne({ phone: phone });

    if (userPhone) {
      req.session.phone=phone
      const otp = Math.floor(1000 + Math.random() * 9000);
      console.log(otp);

      req.session.otp = otp;

      const otpTimeLimit=10000

      setTimeout(()=>{
        req.session.otp=null;
      },otpTimeLimit)

      res.render("enterOtp",{otpTimeLimit:10000});
    } else {
      res.send("Wrong", error);
    }
  } catch (error) {
    console.log(error);
  }
};

const forgotPhoneVerify = async (req, res) => {
  try {
    const phone = req.body.ph;
    req.session.phone = phone;

    const userData = await User.findOne({ phone: phone });
    req.session.userEmail = userData.email;
    console.log(req.session.userEmail);

    if (userData) {
      const otp = Math.floor(1000 + Math.random() * 9000);
      console.log(otp);

      req.session.otp = otp;

      res.render("forgotEnterOtp");
    } else {
      res.send("Wrong");
    }
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    res.render("forgot");
  } catch (error) {
    console.log(error);
  }
};

const checkOtp = async (req, res) => {
  try {

    const phone=req.session.phone
    const userdata=await User.findOne({phone:phone})
    const userEmail=userdata.email
    const { otp } = req.body;

    const storedOtp = req.session.otp;

    delete req.session.otp;

    if (!otp || otp === "") {
      console.log("OTP is not provided");
      res.redirect("/enterOtp");
      return;
    }
    if (Number(otp) === storedOtp) {
      console.log("OTP verification successful");
      req.session.userEmail=userEmail
      res.redirect("/home");
    } else {
      console.log("OTP verification failed");
      res.render("enterOtp", { message: "incorrect OTP" });
    }
  } catch (error) {
    console.log(error);
  }
};

const forgotCheckOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    const storedOtp = req.session.otp;

    delete req.session.otp;

    if (!otp || otp === "") {
      console.log("OTP is not provided");
      res.redirect("/enterOtp");
      return;
    }
    if (Number(otp) === storedOtp) {
      console.log("OTP verification successful");
      res.redirect("/setNewPassword");
    } else {
      console.log("OTP verification failed");
      res.render("enterOtp", { message: "incorrect OTP" });
    }
  } catch (error) {
    console.log(error);
  }
};


const matchPassword = async (req, res) => {
  try {
    const password1 = req.body.pass1;
    const password2 = req.body.pass2;

    if (password1 && password2) {
      if (password1 === password2) {
        const storedPhone = req.session.phone;

        const user = await User.findOne({ phone: storedPhone });
        console.log(user);
        const fpassword = await securePassword(password1);

        if (user) {
          user.password = fpassword;
          await user.save();
        }

        res.render("login", { message: "password changed successfully" });
      } else {
        res.render("setNewPass", { message: "passwords doesn't match" });
      }
    } else if (password1) {
      res.render("setNewPass", { message: "enter the password again" });
    } else if (password2) {
      res.render("setNewPass", { message: "enter the fist password" });
    } else {
      res.render("setNewPass", { message: "enter the password" });
    }
  } catch (error) {
    console.log(error);
  }
};

const loadCart = async (req, res) => {
  try {
    res.render("cart");
  } catch (error) {
    console.log(error);
  }
};

const Logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadRegister,
  loadLogin,
  insertUser,
  verify,
  loadOtp,
  loadHome,
  phoneVerify,
  forgotPassword,
  checkOtp,
  forgotCheckOtp,
  forgotPhoneVerify,
  matchPassword,
  loadCart,
  Logout,
};
