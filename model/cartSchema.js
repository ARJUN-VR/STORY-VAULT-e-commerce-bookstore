const mongoose=require('mongoose')

const cartSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    cartItems:[],
    cartTotal:{
        type:Number
    }
})

module.exports=mongoose.model('cart',cartSchema)