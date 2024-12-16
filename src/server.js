const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

//routes
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin/admin_user");
const leadRoutes = require("./routes/lead");

//environment variable
env.config();

//mongodb connection
mongoose
  .connect(
    `mongodb+srv://amit:amit1234@cluster0.m1zvmoi.mongodb.net/?retryWrites=true&w=majority`, //cloud
    // process.env.MongoDB_URI, //local
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  });

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", leadRoutes);


