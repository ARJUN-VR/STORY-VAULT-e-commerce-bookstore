const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    orderdetails:[],
    Total:{type:Number},
    cancel:{
        type:String
    }

  
})
module.exports=mongoose.model('orders',orderSchema)