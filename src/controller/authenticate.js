const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  // console.log(req.body);
  try {

  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user)
      return res.status(400).json({
        message: "User already exists",
      });

    const {
      firstname,
      lastname,
      email,
      password,
      ekno,
      division,
      department,
      role,
      region,
      access,
      phoneNumber
    } = req.body;
    // console.log("🚀 ~ _user.save ~ phoneNumber:", phoneNumber)

    const _user = new User({
      firstname,
      lastname,
      email,
      password,
      ekno,
      division,
      department,
      role,
      region,
      access,
      phoneNumber
    });
    console.log("🚀 ~ _user.save ~ _user:", _user)

    _user.save((err, data) => {
      if (err) {
        return res.status(400).json({
          message: "Something went wrong",
          err:err.message || err         
        });
      } else {
        console.log("data",data)
        return res.status(201).json({
          user: "User created Successfully",
        });
      }
    });
  });
          
  } catch (error) {
    console.log("🚀 ~ error:", error)
    
  }
};

exports.login = (req, res) => {
  // console.log(res.body);
  User.findOne({ email: req.body.email, status: "active" }).exec(
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      if (user) {
        if (user.authenticate(req.body.password)) {
          const token = jwt.sign({ _id: user._id }, process.env.JWTSECRET, {
            expiresIn: "30m",
          });
          const {
            _id,
            firstname,
            lastname,
            email,
            fullname,
            ekno,
            department,
            role,
            region,
            access,
            lastLogin,
            currentLogin,
          } = user;
          res.cookie("token", token, { expiresIn: "30m" });
          res.status(200).json({
            token,
            user: {
              _id,
              firstname,
              lastname,
              email,
              fullname,
              ekno,
              department,
              role,
              region,
              access,
              lastLogin,
              currentLogin,
            },
          });
          User.updateOne(
            { email: req.body.email },
            { $set: { lastLogin: currentLogin } },
            (err, res) => {
              if (err) throw err;
            }
          );
        } else {
          return res.status(400).json({
            message: "Invalid user or password",
          });
        }
      } else {
        res.status(200).json({
          message: "Something went wrong",
        });
      }
    }
  );
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout Successfully",
  });
};

// TODO:
// add a method to delet users **soft delete**
