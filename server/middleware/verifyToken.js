const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(400).send("Token not found");
    }
    const verify = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(verify);
    req.user = verify.user;
    next();
  } catch (err) {
    return res.status(401).send({ error: err.message });
  }
};
