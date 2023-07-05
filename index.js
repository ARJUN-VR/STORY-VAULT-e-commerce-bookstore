const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/practise");

const path=require('path')



const express = require("express");
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

app.use("/", userRoute);
app.use("/admin", adminRoute);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
