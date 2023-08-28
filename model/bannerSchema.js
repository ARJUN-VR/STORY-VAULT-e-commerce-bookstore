const mongoose = require('mongoose')

const bannerSchema=mongoose.Schema({
    Image:{
        type:Array
    },
    description:{
        type:String
    },
    productimg:{
        type:Array
    }

})

module.exports=mongoose.model('banner',bannerSchema)