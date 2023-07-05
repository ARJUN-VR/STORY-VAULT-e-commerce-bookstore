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
  address: {
    type: String,
    required: true,
  },
  phone: {
    type:Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_blocked:{
    type:Number,
    required:false,
  }
});
module.exports = mongoose.model("User", userSchema);
