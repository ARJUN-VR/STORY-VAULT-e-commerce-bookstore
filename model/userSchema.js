const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address:[],

  phone: {
    type:Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet:{
    type:Number
    },
  is_blocked:{
    type:Boolean,
    required:false,
  }
});


module.exports = mongoose.model("User", userSchema);
