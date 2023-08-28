require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
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
