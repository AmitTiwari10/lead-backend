const jwt = require("jsonwebtoken");

exports.requireLogin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWTSECRET);
    req.user = user;
  } else {
    return res.status(400).json({ message: "Authorization Required" });
  }
  next();
};

exports.leadMiddleware = (req, res, next) => {
  console.log(req.lead);
  if (req.lead.status === "ASSIGNED") {
    return res.status(400).json({ message: "Lead already assigned" });
  } else {
    console.log("processing");
  }
  next();
};
