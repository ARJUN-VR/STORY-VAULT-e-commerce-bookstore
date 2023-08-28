const mongoose=require('mongoose')
const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    Image:{
        type:Array,
        required:true
    },
   
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    is_listed:{
        type:Boolean,
        required:true
    }
})

module.exports=mongoose.model('product',productSchema)