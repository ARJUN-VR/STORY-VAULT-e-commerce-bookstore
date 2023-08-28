const mongoose = require('mongoose')

const couponSchema = mongoose.Schema({
    couponCode:{type:String},
    validity:{type:Date},
    minpurchase:{type:Number},
    discount:{type:Number},
    maxdiscountvalue:{type:Number},
    description:{type:String},
    createdAt:{type:Date,default:new Date()},
    status:{type:String}
})
module.exports=mongoose.model('coupon',couponSchema)