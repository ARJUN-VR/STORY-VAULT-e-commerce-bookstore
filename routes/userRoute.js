const express = require("express");
const userRoute = express();
// const jwt=require('jsonwebtoken')
const session = require("express-session");

// const twilio=require('twilio')
// const { accountSid, authToken } = require('../config');
// const client = twilio(accountSid, authToken);
// const crypto=require('crypto')
// const jwtSecretKey = crypto.randomBytes(32).toString('hex');

userRoute.use(
  session({
    secret: "mysessionsecretkey",
    resave: false,
    saveUninitialized: true,
  })
);
const auth = require('../middlewares/auth')

userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));

const nocache = require("nocache");
userRoute.use(nocache());

userRoute.set("view engine", "ejs");
userRoute.set("views", "./views/user");

const userController = require("../controller/userController");

userRoute.get("/", userController.loadLogin);

userRoute.get("/register", userController.loadRegister);
userRoute.post("/register", userController.insertUser);

userRoute.post("/login", userController.verify);
userRoute.get('/home',auth.login,userController.loadHome)

userRoute.get('/cart',auth.login,userController.loadCart)

userRoute.get("/otp", userController.loadOtp);
userRoute.post("/sendOtp", userController.phoneVerify);

userRoute.post("/forgot-sendOtp", userController.forgotPhoneVerify);

userRoute.get("/setNewPassword", (req, res) => {
  res.render("setNewPass");
});

userRoute.post("/set-pass", userController.matchPassword);

// forgot-password

userRoute.get("/forgot-password", userController.forgotPassword);

// userRoute.post('/sendOtp',(req,res)=>{
//     const userNo=req.body.ph

//     const otp=Math.floor(1000+Math.random()*9000)

//     console.log(otp);

//     req.session.otp=otp

// const token=jwt.sign({otp},jwtSecretKey,{expiresIn:'1m'})

// client.messages.create({
//     body:`your OTP is ${otp} `,
//     from:'+15416157237',
//     to:userNo
// })
// .then(()=>{
//     console.log('otp send succesfully');

// })
// .catch((err)=>{
//     console.log('unsuccesful',err);
// })
//     res.redirect('/enterOtp')

// })

userRoute.get("/enterOtp", (req, res) => {
  res.render("enterOtp");
});

userRoute.post("/check-otp", userController.checkOtp);
userRoute.post("/forgot-check-otp", userController.forgotCheckOtp);


userRoute.get('/logout',userController.Logout)

// userRoute.get('*',(req,res)=>{
//   res.redirect('/')
// })

module.exports = userRoute;
