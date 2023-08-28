const Order = require("../model/order");
const Cart = require("../model/cartSchema");
const User= require('../model/userSchema')
const mongoose=require('mongoose')
const paypal = require('../config/paypal');
const Product=require('../model/productSchema')

const addOrder = async (req, res,address) => {
  try {
    const userid = req.session.userid;
   

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
          cartTotal:1,
         _id:0
        },
      },
    ]);
    console.log(data);

    let total=data[0].cartTotal
    // data.forEach((item)=>{
    //   total+=item.carted.price*item.quantity
    // })
    console.log(total+' total');
    console.log('method '+req.body.method);

    if(req.body.method=='wallet'){
      const user=await User.findOne({_id:userid})
     if(user.wallet<total){
      return res.send({ message: 'You don\'t have enough money.' });
     }
    }
 

  
    const userdata=await User.findOne({_id:req.session.userid})
    const useraddress=userdata.address
    let orderaddress;
    
  
    if(typeof address==='string'){
     orderaddress = useraddress.find(item => item.id === address);
    }else{
     orderaddress = useraddress.find(item => item.id === req.body.addressId);
    }
  


    const currentDate = new Date();
    const paymentMethod=req.body.method
    

    
    const orderDetails = data.map((items)=>{
      const status='placed'

      return{
        ...items,
        date:currentDate,
        status,
        orderaddress,
        paymentMethod,
        
      }
      

    })
   
    const orders = new Order({
        user: new mongoose.Types.ObjectId(userid),
        orderdetails: [],
        cancel:'',
        Total:0
      });

      orders.orderdetails.push(...orderDetails)
      orders.Total=total
      await orders.save()

      if(req.body.method=='wallet'){
        await User.findOneAndUpdate({_id:req.session.userid},{$set:{wallet:userdata.wallet-total}})
      }

      data.forEach(async(items)=>{
        await Product.findOneAndUpdate({_id:items.carted._id},{$set:{stock:items.carted.stock-items.quantity}}) 
      })


    await Cart.deleteOne({user:userid})

   res.redirect('/order-success')

  } catch (error) {
    console.log(error);
  }
};

const loadOrder=async(req,res)=>{
  try{
    const userid = req.session.userid;
    const userdata = await User.findOne({ _id: userid });
   const user=new mongoose.Types.ObjectId(req.session.userid)
    const data = await Order.aggregate([
      {
        $match:{
          user:user
        }
      },
      {
        $unwind:"$orderdetails"
      },
      {
        $project:{
          orderdetails:1,
          
          _id:1, 
        }
      },{
        $sort:{
          _id:-1
        }
      }
    ])
   
   res.render('order',{userdata,data})

  }catch(error){
    console.log(error);
  }
}

const cancelOrder=async(req,res)=>{
  try{
    const reason =req.body.reason
    
    const productId=new mongoose.Types.ObjectId(req.query.productId)
     

     const userId=req.session.userid
     

  const order= await Order.findOneAndUpdate({user:userId,"orderdetails.carted._id": productId },
                                { $set: { "orderdetails.$.status": "cancel requested" ,cancel:reason} })

                                

                         
 
     if(order.orderdetails[0].paymentMethod=='wallet'|| order.orderdetails[0].paymentMethod=='paypal'){
      let total=0;
       order.orderdetails.forEach((item)=>{
        if (String(item.carted._id) === String(productId)) {
          total=item.carted.price*item.quantity 
        }
      })
      const user=await User.findOne({_id:userId})
      const Wallet=user.wallet
      await User.findOneAndUpdate({_id:userId},{$set:{wallet:Wallet+total}})
     }
    
  
    res.redirect('/orderlist')

  }catch(error){
    console.log(error);
  }
}

const returnOrder=async(req,res)=>{
  try{
    const productId=new mongoose.Types.ObjectId(req.query.productId)
     console.log(productId);

     const userId=req.session.userid

    await Order.findOneAndUpdate(
      { user: userId, "orderdetails.carted._id": productId },
      { $set: { "orderdetails.$.status": "requested" } }
    );

    res.redirect('/orderlist')

  }catch(error){
    console.log(error);
  }
}



const payment = async (req, res) => {
    try {
     const cart = await Cart.findOne({user:req.session.userid})

  const address=req.body.addressId
  console.log(address+"fiisglsgjsfjglg");
     let totalPrice=0;
     cart.cartItems.forEach((item)=>{
      totalPrice+=item.price
     })
       
  
        const amount = {
            "currency": "USD", //currency
            "total": totalPrice ,//total amount
            
        }


        const paymentData = {
          
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
              "return_url": `http://localhost:3000/success?address=${encodeURIComponent(address)}`, // if successful return URL
                "cancel_url": "http://localhost:3000/cancel" // if canceled return URL
            },
            "transactions": [{
             
                "amount": amount, // the amount
                "description": "Payment using PayPal"
            }]
        }

        paypal.payment.create(paymentData, function (err, payment) {
            if (err) {
                throw err;
                
            } else {
              console.log('in here');
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                      const redirectURL = payment.links[i].href;
                      console.log('Redirect URL:', redirectURL);// Log the redirect URL
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        })

    } catch (error) {
        console.log(error);
    }
}
const handlePayment = async (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const address=req.query.address;
  console.log("second dest "+address);

  const executePayment = {
    payer_id: payerId,
  };

  paypal.payment.execute(paymentId, executePayment, async (error, payment) => {
    if (error) {
      console.error('Error executing PayPal payment:', error);
      res.redirect('/cancel');
    } else {
      try {
        console.log("'third "+address);
        await addOrder(req, res,address); // Wait for the addOrder function to complete
      
      } catch (error) {
        console.log(error);
        res.redirect('/cancel'); // Handle errors by redirecting to cancel page
      }
    }
  });
};

const orderSuccess= async(req,res)=>{
  try{
    const userdata=await User.findOne({_id:req.session.userid}); 
    const orderdata=await Order.find({user:req.session.userid});
   const currentOrder=orderdata[orderdata.length-1]  ;
   const address=[currentOrder.orderdetails[0].orderaddress];

    res.render('success-page',{userdata,currentOrder,address});

  }catch{
    console.log(error);
  }
}

const successpageforindividualproduct=async(req,res)=>{
  try{
    const currentOrder = await Order.findOne({ _id: req.query.productId });
    const userdata=await User.findOne({_id:req.session.userid})
    const address=[currentOrder.orderdetails[0].orderaddress]
    res.render('success-page',{userdata,currentOrder,address});
  }catch{
    console.log(err);
  }
}


module.exports = {
  addOrder,
  loadOrder,
  cancelOrder,
  returnOrder,
  payment,
  handlePayment,
  orderSuccess,
  successpageforindividualproduct
};



