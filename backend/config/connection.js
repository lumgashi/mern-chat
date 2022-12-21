const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

mongoose.connect(
  `mongodb+srv://${process.env.ADMIN_DB}:${process.env.ADMIN_PW}@chat.jy09lim.mongodb.net/?retryWrites=true&w=majority`,
  () => {
    console.log("Connected to mongodb");
  }
);
