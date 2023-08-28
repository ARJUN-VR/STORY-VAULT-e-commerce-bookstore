const mongoose = require("mongoose");
const Cart = require("../model/cartSchema");
const Product = require("../model/productSchema");
const User = require("../model/userSchema");
const Coupon=require('../model/coupon')


const loadCart = async (req, res) => {
  try {
    const userid = req.session.userid;
    const userdata = await User.findOne({ _id: userid });

    const data = await Cart.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userid),
        },
      },

      {
        $unwind: "$cartItems",
      },
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "carted",
        },
      },
      {
        $unwind: "$carted",
      },
      {
        $project: {
          carted: 1,
          quantity: "$cartItems.quantity",
          cartItems:1
        },
      },
    ]);

    res.render("cart", { data, userdata });
  } catch (error) {
    console.log(error);
  }
};

const addCart = async (req, res) => {
  try {

    const userId = req.session.userid;
    const productId = req.params.id;

    const [user, product] = await Promise.all([
      User.findOne({ _id: userId }),
      Product.findOne({ _id: productId }),
    ]);
    if (!user || !product) {
      res.status(404);
    }

    if(product.stock==0){
     return res.send({status:false})
    }
    const cartItem = {
      productId: product._id,
      quantity: 1,
      price: product.price,
    };

    let cart = await Cart.findOne({ user: userId });

  
   

    if (!cart) {
      cart = new Cart({
        user: userId,
        cartItems: [],
        cartTotal:0
        

      });
    }

    const existingcartitem = await cart.cartItems.find((items) => {
      return items.productId.toString() === product._id.toString();
    }); 
 

    if (existingcartitem) {
      existingcartitem.quantity += 1;
    } else {
      cart.cartItems.push(cartItem);
    }

    cart.cartTotal=0;
    cart.cartItems.forEach((item)=>{
      cart.cartTotal+=item.quantity*item.price
    })
    await cart.save();
  

    res.send({ status: true });
  } catch (error) {
    console.log(error);
  }
};

const updatecart = async (req, res) => {
  try {
    const userid = req.session.userid;
    // console.log(userid);
    const productId = req.params.id;
    // console.log(productId);
    const newquantity = req.body.quantity;
   

    const product = await Product.findOne({ _id: productId });
    // console.log(product);

    const cart = await Cart.findOne({ user: userid });
    // console.log(cart);
    let sum = 0;
    const existingcartitem = await cart.cartItems.find((items) => {
      return items.productId.toString() === product._id.toString();
    });
 

    if (existingcartitem) {
      existingcartitem.quantity = newquantity;
      await cart.save();
   
    } else {
      console.log("no item");
    }

    //  console.log(existingcartitem);
    const totalPrice = existingcartitem.quantity * existingcartitem.price;
   
    let cartTotal = 0;

    cart.cartItems.forEach((item) => {
      cartTotal += item.quantity * item.price;
    });

 

    res.send({ status: true, totalPrice: totalPrice, cartTotal: cartTotal });
  } catch (error) {
    console.log(error);
  }
};

const loadCheckout = async (req, res) => {
  try {
    const userid = req.session.userid;
 
    const userdata = await User.findOne({ _id: userid });

    const address=userdata.address
    console.log('this is a address '+address);

    const addressId=req.params.id
    let addresstodisplay;
    if(addressId){
   
      const address=userdata.address.find((items)=>{
        return items.id===addressId
      })
       addresstodisplay=address
    }else{
     
     addresstodisplay=userdata.address[address.length-1]
    }
    
    const data = await Cart.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userid),
        },
      },

      {
        $unwind: "$cartItems",
      },
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "carted",
        },
      },
      {
        $unwind: "$carted",
      },
      {
        $project: {
          carted: 1,
          quantity: "$cartItems.quantity",
          cartTotal:1
        },
      },
    ]);

    const cart = await Cart.findOne({ user: userid });
    let subtotal = 0;
    if(cart==null){
    return  res.redirect('/')
    }else{
      cart.cartItems.forEach((items) => {
        subtotal += items.quantity * items.price;
      });
    }
 

    res.render("checkout", { userdata, data, subtotal,address,addresstodisplay });
  } catch (error) {
    console.log(error);
  }
};

const remove = async (req, res) => {
  try {
    const productid = new mongoose.Types.ObjectId(req.params.id);
    

    const userid = req.session.userid;
    const cart = await Cart.findOne({ user: userid });
    
    if (!cart) {
      res.status(404)
      return;
    }



    const item = cart.cartItems.find((item) => item.productId.toString() === productid.toString());

    if (!item) {
      res.redirect('/cart-page');
      return;
    }

    const itemId = item.productId;

    cart.cartItems = cart.cartItems.filter(
      (item) => item.productId.toString() !== itemId.toString()
    );

    try {
      await cart.save();
      res.redirect('/get-cart');
    } catch (error) {
      res.redirect('/error-page');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/error-page');
  }
};

const coupon=async(req,res)=>{
  try{
   const coupon= await Coupon.findOne({couponCode:req.body.coupon})
   
   if(!coupon){
    return res.send({status:false})
   }
   if(coupon.status=='unvalid'){
    return res.send({status:'unvalid'})
   }
   const valid=coupon.validity-new Date()
  
  
   if(valid>0){
   
    const cart = await Cart.findOne({user:req.session.userid})
    const total=cart.cartTotal

    if(total>=coupon.minpurchase){
      const code=coupon.couponCode
      const discount=coupon.discount
      await Cart.findOneAndUpdate({user:req.session.userid},{$set:{cartTotal:total-(total/discount)}})
      await Coupon.findOneAndUpdate({couponCode:code},{$set:{status:'unvalid'}})
    }else{
    
      return res.send({ status: 'nominbal'});
    }
 
   }else{
    return res.send({status:'expired'})//if coupon expired
   }
   const newcart=await Cart.findOne({user:req.session.userid})
   const newtotal=newcart.cartTotal
   res.send({status:true,newtotal:newtotal})

    
  }catch(error){
    console.log(error);
  }
}

module.exports = {
  loadCart,
  addCart,
  updatecart,
  loadCheckout,
  remove,
  coupon

};
