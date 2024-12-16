const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hash_password: {
      type: String,
      required: true,
    },
    ekno: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
    },
    division: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    access: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["user", "admin", "sales", "superuser"],
      default: "user",
    },
    phoneNumber:{
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["active", "inactive"],
      default: "active",
    },
    profile_picture: String,
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("password").set(function (password) {
  this.hash_password = bcrypt.hashSync(password, 10);
});

userSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hash_password);
  },
};

userSchema.virtual("fullname").get(function () {
  const name = `${this.firstname} ${this.lastname}`;
  return name.toUpperCase();
});

userSchema.virtual("currentLogin").get(function () {
  const today = Date.now();
  const dateTime = new Date(today);
  return dateTime.toLocaleString("en-US", { timeZone: "Africa/Nairobi" });
});

module.exports = mongoose.model("User", userSchema);
