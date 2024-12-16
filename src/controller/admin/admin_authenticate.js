const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const user = require("../../models/user");

exports.register = (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user)
      return res.status(400).json({
        message:
          "User already exists to create user as admin go to update user",
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
    } = req.body;

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
    });

    console.log("🚀 ~ _user.save ~ _user: 11", _user)
    _user.save((err, data) => {
      if (err) {
        return res.status(400).json({
          message: err,
        });
      } else {
        return res.status(201).json({
          user: "Admin created Successfully",
        });
      }
    });
  });
    console.log("🚀 ~ User.findOne ~ _user:", _user)
    console.log("🚀 ~ User.findOne ~ _user:", _user)
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if (user) {
      if (user.authenticate(req.body.password)) {
        const token = jwt.sign({ _id: user._id }, process.env.JWTSECRET, {
          expiresIn: "1h",
        });
        const {
          _id,
          firstname,
          lastname,
          email,
          fullname,
          role,
          access,
          lastLogin,
          currentLogin,
        } = user;
        res.status(200).json({
          token,
          user: {
            _id,
            firstname,
            lastname,
            email,
            fullname,
            role,
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
            console.log("1 document updated");
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
  });
};

exports.updateUserToAdmin = (req, res) => {
  user.findOne({ email: req.body.email, access: "user" }).exec((err, user) => {
    if (user) {
      User.updateOne(
        { email: req.body.email },
        { $set: { access: "admin" } },
        (err, res) => {
          if (err) throw err;
        }
      );
      return res.status(201).json({
        message: "User updated to Admin",
      });
    }
    return res.status(400).json({
      message: "user already an admin",
    });
  });
};

exports.updateAdminToUser = (req, res) => {
  user.findOne({ email: req.body.email, access: "admin" }).exec((err, user) => {
    if (user) {
      User.updateOne(
        { email: req.body.email },
        { $set: { access: "user" } },
        (err, res) => {
          if (err) throw err;
        }
      );
      return res.status(201).json({
        message: "Admin updated to user",
      });
    }
    return res.status(400).json({
      message: "user already a normal user",
    });
  });
};

exports.requireLogin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const user = jwt.verify(token, process.env.JWTSECRET);
  req.user = user;
  next();
};
