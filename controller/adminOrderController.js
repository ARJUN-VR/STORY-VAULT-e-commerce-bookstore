const { default: mongoose } = require('mongoose')
const Order=require('../model/order')
const User = require('../model/userSchema')

const loadOrder=async(req,res)=>{
  try{
    const orderdata=await Order.aggregate([
      {
        $match:{}
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userdata",
        },
      }
    ])

   
    res.render('order',{orderdata})

  }catch(error){
    console.log(error);
  }

}
   

const loadDetail=async(req,res)=>{
    try{
       
        const data=await Order.findOne({_id:req.params.id})
        const userdata = await User.findOne({_id:data.user})


    
   
        res.render('detail',{data,userdata})
      
    }catch(error){
      console.log(error);
    }
  }

  const orderCancel = async (req, res) => {
    try {
      const orderId =req.query.orderId
      const proId =new mongoose.Types.ObjectId(req.query.proId) 
      console.log("orderid "+orderId);
      console.log("proid "+proId);


  
      // Update the status to "cancelled" in the database
      await Order.findOneAndUpdate(
        { _id: orderId, "orderdetails.carted._id": proId },
        { $set: { "orderdetails.$.status": "cancelled" } }
      );
  
     
      // Once the update is complete, send the success response to the client
      res.redirect('/admin/order')
    } catch (error) {
      console.error('Error occurred while canceling the order:', error);
      res.status(500).send('Error occurred while canceling the order');
    }
  };


  const accept = async (req, res) => {
    try {
      const orderId = req.query.orderId;
      const proId =new mongoose.Types.ObjectId(req.query.proId)  
  
      // Update the status to "cancelled" in the database
      await Order.findOneAndUpdate(
        { _id: orderId, "orderdetails.carted._id": proId },
        { $set: { "orderdetails.$.status": "accepted" } }
      );
  
     
      // Once the update is complete, send the success response to the client
      res.redirect('/admin/order')
    } catch (error) {
      console.error('Error occurred while canceling the order:', error);
      res.status(500).send('Error occurred while canceling the order');
    }
  };

  const decline = async (req, res) => {
    try {
      const orderId = req.query.orderId;
      const proId =new mongoose.Types.ObjectId(req.query.proId) 
  
      // Update the status to "cancelled" in the database
      await Order.findOneAndUpdate(
        { _id: orderId, "orderdetails.carted._id": proId },
        { $set: { "orderdetails.$.status": "declined" } }
      );
      // Once the update is complete, send the success response to the client
      res.redirect('/admin/order')
    } catch (error) {
      console.error('Error occurred while canceling the order:', error);
      res.status(500).send('Error occurred while canceling the order');
    }
  };

  const dispatch=async(req,res)=>{
    try {
      const orderId = req.query.orderId;
      const proId =new mongoose.Types.ObjectId(req.query.proId) 
  
      // Update the status to "cancelled" in the database
      await Order.findOneAndUpdate(
        { _id: orderId, "orderdetails.carted._id": proId },
        { $set: { "orderdetails.$.status": "dispatched" } }
      );
      // Once the update is complete, send the success response to the client
      res.redirect('/admin/order')
    } catch (error) {
      console.error('Error occurred while canceling the order:', error);
      res.status(500).send('Error occurred while canceling the order');
    }
  };

  const deliver=async(req,res)=>{
    try {
      const orderId = req.query.orderId;
      const proId =new mongoose.Types.ObjectId(req.query.proId) 
  
      // Update the status to "cancelled" in the database
      await Order.findOneAndUpdate(
        { _id: orderId, "orderdetails.carted._id": proId },
        { $set: { "orderdetails.$.status": "delivered" } }
      );
      // Once the update is complete, send the success response to the client
      res.redirect('/admin/order')
    } catch (error) {
      console.error('Error occurred while canceling the order:', error);
      res.status(500).send('Error occurred while canceling the order');
    }
  };


  const acceptCancel = async (req, res) => {
    try {
      const orderId = req.query.orderId;
      const proId =new mongoose.Types.ObjectId(req.query.proId)  
  
      // Update the status to "cancelled" in the database
      await Order.findOneAndUpdate(
        { _id: orderId, "orderdetails.carted._id": proId },
        { $set: { "orderdetails.$.status": "cancelled" } }
      );
  
     
      // Once the update is complete, send the success response to the client
      res.redirect('/admin/order')
    } catch (error) {
      console.error('Error occurred while canceling the order:', error);
      res.status(500).send('Error occurred while canceling the order');
    }
  };

  const declineCancel = async (req, res) => {
    try {
      const orderId = req.query.orderId;
      const proId =new mongoose.Types.ObjectId(req.query.proId) 
  
      // Update the status to "cancelled" in the database
      await Order.findOneAndUpdate(
        { _id: orderId, "orderdetails.carted._id": proId },
        { $set: { "orderdetails.$.status": "cancel declined" } }
      );
      // Once the update is complete, send the success response to the client
      res.redirect('/admin/order')
    } catch (error) {
      console.error('Error occurred while canceling the order:', error);
      res.status(500).send('Error occurred while canceling the order');
    }
  };

 
  
  
  
  
  module.exports={
    loadOrder,
    loadDetail,
    orderCancel,
    accept,
    decline,
    dispatch,
    deliver,
    acceptCancel,
    declineCancel 
  }
  
