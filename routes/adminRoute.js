const express = require("express");
const adminRoute = express();



const session = require("express-session");

adminRoute.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
const adminController=require('../controller/adminController')

adminRoute.set("view engine", "ejs");
adminRoute.set("views", "./views/admin");

adminRoute.use(express.json());
adminRoute.use(express.urlencoded({ extended: true }));
adminRoute.get('/',adminController.adminLogin)
adminRoute.post('/',adminController.adminVerify)
adminRoute.get('/product',adminController.loadProduct)
adminRoute.get('/users',adminController.loadUser)

adminRoute.post('/block',adminController.block)

module.exports = adminRoute;
