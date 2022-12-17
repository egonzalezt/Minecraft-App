const mongoose = require("mongoose");

var uri = process.env.MONGOURL;

mongoose.set("strictQuery", false);
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

module.exports = connection;
