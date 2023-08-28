const express = require("express");
const adminRoute = express();
const multer = require("multer");
const path = require("path");
const adminAuth = require("../middlewares/adminAuth");
const adminController = require("../controller/adminController");
const catogoryController = require("../controller/catogoryController");
require("dotenv").config();

const upload = require("../multer/multer");
const session = require("express-session");

adminRoute.use(express.static(path.join(__dirname, "public/uploads")));

adminRoute.use(
  session({
    secret: process.env.ADMIN_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
  
const productController = require("../controller/productController");
const adminOrderController=require('../controller/adminOrderController')
const adminCouponController=require('../controller/adminCouponController')
const bannerController=require('../controller/bannerController')

adminRoute.set("view engine", "ejs");
adminRoute.set("views", "./views/admin");

adminRoute.use(express.json());
adminRoute.use(express.urlencoded({ extended: true }));

adminRoute.get("/", adminController.adminLogin);
adminRoute.post("/", adminController.adminVerify);

adminRoute.get("/home", adminController.loadhome);
adminRoute.get("/product", productController.loadProduct);
adminRoute.post(
  "/addproduct",
  upload.array("Image", 3),
  productController.imageUpload,
  productController.insertProduct
);

adminRoute.get("/catogory", adminAuth.login, adminController.loadCatogory);
adminRoute.get("/users", adminAuth.login, adminController.loadUser);

adminRoute.get("/list", adminAuth.login, catogoryController.listcat);
adminRoute.get("/productList", productController.list);
adminRoute.post(
  "/addCategory",
  adminAuth.login,
  catogoryController.insertCatogory
);

adminRoute.get("/EditCategory", catogoryController.loadEdit);
adminRoute.post("/updateCategory", catogoryController.updateCategory);

adminRoute.get("/productEdit", productController.edit);

adminRoute.post("/updateProduct", productController.update);

adminRoute.get("/block", adminController.block);

adminRoute.get("/logout", adminAuth.Logout);


adminRoute.get('/order',adminOrderController.loadOrder)

adminRoute.get('/show-detail:id',adminOrderController.loadDetail)

adminRoute.get('/cancel',adminOrderController.orderCancel)

adminRoute.get('/accept',adminOrderController.accept)

adminRoute.get('/decline',adminOrderController.decline)

adminRoute.get('/Dispatch',adminOrderController.dispatch)

adminRoute.get('/Deliver',adminOrderController.deliver)

adminRoute.get('/coupon',adminCouponController.loadCoupon)

adminRoute.post('/addcoupon',adminCouponController.addCoupon)


adminRoute.get('/delete-coupon',adminCouponController.deleteCoupon)


adminRoute.get('/LoadBanner',bannerController.LoadBanner)

adminRoute.post('/addbanner',bannerController.addBanner)

adminRoute.get('/deleteBanner',bannerController.deleteBanner)

adminRoute.get('/loadSales',adminController.LoadSales)

adminRoute.get('/acceptCancel',adminOrderController.acceptCancel)

adminRoute.get('/declineCancel',adminOrderController.declineCancel)


// adminRoute.get('/download',adminController.downloadSales)






module.exports = adminRoute;
