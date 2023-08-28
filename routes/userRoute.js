const express = require("express");
const userRoute = express();

const session = require("express-session");



const crypto=require('crypto')


userRoute.use(
  session({
    secret: process.env.SECRET,
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
const cartController=require('../controller/cartController')
const orderController=require('../controller/orderController');
const addressController=require('../controller/addressController')


userRoute.get("/login", userController.loadLogin);

userRoute.get("/register", userController.loadRegister);
userRoute.post("/register", userController.insertUser);

userRoute.post("/login", userController.verify);
userRoute.get('/',userController.loadHome)

// userRoute.get('/cart',auth.login,userController.loadCart)

userRoute.get("/otp", userController.loadOtp);
// userRoute.post("/sendOtp", userController.phoneVerify);

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

userRoute.get('/single-product',userController.loadsingleproduct)

userRoute.get('/category-products',userController.productsbycategory)

userRoute.get('/get-cart',auth.login,cartController.loadCart)
userRoute.post('/add-cart/:id',auth.login,cartController.addCart)

userRoute.post('/update-quantity/:id',cartController.updatecart)

userRoute.get('/checkout:id',cartController.loadCheckout)
userRoute.get('/checkout',cartController.loadCheckout)


userRoute.post('/place-order',orderController.addOrder)

userRoute.get('/remove:id',cartController.remove)

userRoute.get('/orderlist',auth.login,orderController.loadOrder)

userRoute.post('/address',addressController.addAddress)

userRoute.get('/deleteAddress:id',addressController.deleteAddress)

userRoute.post('/order-cancel',orderController.cancelOrder)
userRoute.get('/order-return',orderController.returnOrder)

userRoute.post('/paypal',orderController.payment)

userRoute.get('/success',orderController.handlePayment)

userRoute.get('/cancel',(req,res)=>{
    res.send('failed');
})

userRoute.get('/order-success',orderController.orderSuccess)

userRoute.get('/profile',userController.loadProfile)

userRoute.get('/order-detail',orderController.successpageforindividualproduct)

userRoute.post('/coupon-discount',cartController.coupon)

// userRoute.post('/Cancel-reason',userController)

//add reasons for the cancellations



module.exports = userRoute;







//4.add image cropp
//5.image zoom
//6.stock management
//7.clean-up the template