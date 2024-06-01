require("dotenv").config();
const mongoose = require("mongoose");
console.log(process.env.MONGODB_URI,'checkssss')
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.log('Error connecting to database', error);
})
const nocache = require("nocache");

const path = require("path");
const port = process.env.PORT || 3000;

const express = require("express");

const app = express();
app.use(nocache());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

app.use("/", userRoute);
app.use("/admin", adminRoute);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
//make the it host after test if the app is working or not fg
//if its not rehost using an another cluster in the mongodb atlas



//UPLiFT
//push error changes to the deployment 
// do all of this before tonight 
// fix the errors from on tomorrowcvy