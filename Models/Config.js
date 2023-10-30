const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect(process.env.url, {
  useNewUrlParser: "true",
});

mongoose.connection.on("error", (err) => {
  console.log("mongooose Connenction Error", err);
});

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});
