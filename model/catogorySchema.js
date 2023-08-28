const mongoose=require('mongoose')
const catogorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    is_listed:{
        type:String,
        required:true,
    }
})
module.exports=mongoose.model('catogory',catogorySchema)