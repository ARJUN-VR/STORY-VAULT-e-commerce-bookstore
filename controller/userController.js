const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const Product = require("../model/productSchema");
const Banner = require('../model/bannerSchema');
const twilio=require('twilio')
const { accountSid, authToken,serviceSid } = process.env
console.log(accountSid);
console.log(authToken);
console.log(serviceSid)
const client = new twilio(accountSid, authToken);


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
    const userid = req.session.userid;
    const userdata = await User.findOne({ _id: userid });
    
    res.render("login", { userdata });
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
      phone: "+91" + req.body.no,
      password: spassword,
      wallet:300,
      is_blocked: 0,
    });

    const checkuser = user.email;
    const sameUser = await User.findOne({ email: checkuser });
    if (sameUser) {
      console.log('user exist');
      return res.redirect('/login')
    } else {
      console.log("no same user");
    }
    const userdata = await user.save();
    console.log(userdata);
    if (userdata) {
      res.redirect('/login')
    } else {
      res.redirect('/login')
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
        req.session.userid = userdata._id;
        res.redirect("/");
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
    
    const data = await Product.find();
    const userid = req.session.userid;
    const userdata = await User.findOne({ _id: userid });
    const banner=await Banner.find()

 

    res.render("home", { data, userdata,banner });
  } catch (error) {
    console.log(error);
  }
};
const phoneVerify = async (req, res) => {
  try {
    const phone = req.body.ph;
    const userPhone = await User.findOne({ phone: phone });

    if (userPhone) {
      req.session.phone = phone;
      const otp = Math.floor(1000 + Math.random() * 9000);
      console.log(otp);

      req.session.otp = otp;

      const otpTimeLimit = 10000;

      setTimeout(() => {
        req.session.otp = null;
      }, otpTimeLimit);

      res.render("enterOtp", { otpTimeLimit: 10000 });
    } else {
      res.send("Wrong", error);
    }
  } catch (error) {
    console.log(error);
  }
};

const forgotPhoneVerify = async (req, res) => {
  try {
    const phone ='+91' +req.body.ph;
    req.session.phone=phone

    const verification = await client.verify.v2.services(serviceSid)
      .verifications
      .create({
        to: phone,
        channel: 'sms',
      });

    res.redirect('/enterOtp')

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred' }); // Send an error response if something goes wrong
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
    const phone = req.session.phone;
    // const userdata = await User.findOne({ phone: phone });
    // const userEmail = userdata.email;
    // const { otp } = req.body;

    // const storedOtp = req.session.otp;

    // delete req.session.otp;

    // if (!otp || otp === "") {
    //   console.log("OTP is not provided");
    //   res.redirect("/enterOtp");
    //   return;
    // }
    // if (Number(otp) === storedOtp) {
    //   console.log("OTP verification successful");
    //   req.session.userEmail = userEmail;
    //   res.redirect("/home");
    // } else {
    //   console.log("OTP verification failed");
    //   res.render("enterOtp", { message: "incorrect OTP" });
    // }
    const { otp } = req.body;
    const verifiedresponse=await client.verify.v2.services(serviceSid)
    .verificationChecks
    .create({
      to: phone,
      code:otp,
    });
    res.redirect('/home')



  } catch (error) {
    console.log(error);
  }
};

const forgotCheckOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const verifiedresponse=await client.verify.v2.services(serviceSid)
    .verificationChecks
    .create({
      to: phone,
      code:otp,
    });
    res.redirect('/home')



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
    const userid = req.session.userid;
    const userdata = await User.findOne({ _id: userid });
    res.render("cart", { userdata });
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

const loadsingleproduct = async (req, res) => {
  try {
    const userid = req.session.userid;
    const userdata = User.findOne({ _id: userid });
    const productId = req.query.id;
    const data = await Product.find({ _id: productId });
    // console.log(data);
    res.render("single-product", { data, userdata });
  } catch (error) {
    console.log(error);
  }
};

const productsbycategory = async (req, res) => {
  try {
    const userid = req.session.userid;
    const userdata = await User.findOne({ _id: userid });
    const productCategory = req.query.category;
    const searchQuery = req.query.search;
    const sort=req.query.sort

    let sortType={}

    if(sort=='LtoH'){
      sortType={price:1}
    }else{
      sortType={price:-1}
    }

    // Define the regex pattern based on the user's search prompt
    const regex = new RegExp(searchQuery, "i"); // "i" flag for case-insensitive search

    let data;
    if(productCategory){
       data=await Product.find({category:productCategory})
    }else{
       data = await Product.find({
        $or: [
          { name: { $regex: regex } },
          { description: { $regex: regex } },
        ],
      }).sort(sortType);
    }

    const productsPerPage = 9;
    const totalProducts = data.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const currentPage = req.query.page ? parseInt(req.query.page) : 1;
    const skip = (currentPage - 1) * productsPerPage;

    let paginatedData;
    if(productCategory){
      console.log('aaaaaaa');
       paginatedData = await Product.find({ category: productCategory })
                                     .sort(sortType)
                                     .skip(skip)
                                     .limit(productsPerPage);
    }else{
      console.log('bbbbbbb');
       paginatedData = await Product.find({
                          $or: [
                            { name: { $regex: regex } },
                            { description: { $regex: regex } },
                          ],
                        })
                        .sort(sortType)
                        .skip(skip)
                        .limit(productsPerPage);
    }
    

    res.render("category-products", { data: paginatedData, userdata, totalPages, currentPage });
  } catch (error) {
    console.log(error);
  }
};



const loadProfile=async(req,res)=>{
  try{
    const userdata=await User.findOne({_id:req.session.userid})

    res.render('profile',{userdata})

  }catch(error){
    console.log(error);
  }
}

const cancelReason=async(req,res)=>{
  try{
    

  }catch(error){
    console.log(error);
  }
}



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
  loadsingleproduct,
  productsbycategory,
  loadProfile,
  cancelReason

};
