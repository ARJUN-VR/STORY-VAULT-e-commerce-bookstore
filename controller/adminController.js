const { name } = require("ejs");
const Admin = require("../model/adminSchema");
const User = require("../model/userSchema");
const bcrypt = require("bcrypt");

const adminLogin = async (req, res) => {
  try {   
    res.render("adminLogin");
  } catch (error) {
    console.log("not working", error);
  }
};

const adminVerify = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const adminData = await Admin.findOne({ email: email });
    if (adminData) {
      if (password == adminData.password) {
        res.render("adminHome");
      } else {
        res.render("adminLogin", { message: "check your password" });
      }
    } else {
      res.render("adminLogin", { message: "you have no access" });
    }
  } catch (error) {
    console.log(error);
  }
};
const loadProduct=async(req,res)=>{
  try{
    res.render('product')
  }catch(error){
    console.log(error);
  }
}

const loadUser=async(req,res)=>{
  try{
    const udata=await User.find() //it is the collection
    res.render('users',{udata})
  }catch(error){
    console.log(error);
  }
}

const block=async(req,res)=>{
  try{
    const usersEmail=req.body.email
   
   const userData=await User.findOne({email:usersEmail})
   console.log(userData);
   if(userData){
    if(userData.is_blocked==0){
      userData.is_blocked=1
    }else{
      userData.is_blocked=0
    }
    await userData.save()
   
   }else{
    console.log('user not found');
   }
   console.log(userData);

  }catch(error){
    console.log(error);
  }
}

module.exports = {
  adminLogin,
  adminVerify,
  loadProduct,
  loadUser,
  block
};
