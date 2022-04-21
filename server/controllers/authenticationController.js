const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// models
const User = require("../models/user");
const Scream = require("../models/scream");
const Comment = require("../models/comment");
const Like = require("../models/like");
const Notification = require("../models/notification");
const Follower = require("../models/follower");
const Bookmark = require("../models/bookmark");

//util functions
const validator = require("../util/validators");

//Helper function
const helperFunctions = require("../util/helperFunctions");

//Notification
const deleteAllNotifcationsAssociatedScream = require("../util/notification")
  .deleteAllNotifcationsAssociatedScream;

//Email validators
const emailValidator = require("email-validator");

// Server
const server = require("../services/fileUpload");

// util
const deleteUser = require("../util/deleteSchemas")
  .deleteEverythingAssociatedWithUser;

function jwtSignUser(user) {
  return jwt.sign(
    {
      user,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1 weeks",
    }
  );
}

module.exports = {
  async create(req, res) {
    const { email, password, handle, privacy } = req.body;
    try {
      let errors = {};

      if (validator.validateUser(email, password, handle, errors)) {
        return res.status(400).json(errors);
      }

      if (!emailValidator.validate(email)) {
        return res.status(403).send({ email: "No such email exists" });
      }

      if (
        !validator.max100char(email) ||
        !validator.max50char(password) ||
        !validator.max12char(handle)
      ) {
        return res.status(400).send({ handle: "Too many characters" });
      }

      const userExists = await User.findOne({ email });
      const handleExists = await User.findOne({ handle });

      if (userExists) {
        return res
          .status(400)
          .json({ email: "User with this email already exists" });
      }

      if (handleExists) {
        return res.status(400).json({ handle: "UserHandle is already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashedPassword,
        handle,
      });

      user.userDetail.credentials.email = email;
      user.userDetail.credentials.handle = handle;
      user.userDetail.credentials.privacy = privacy;

      await user.save();

      user.password = undefined;

      const token = jwtSignUser(user);

      res.status(200).send(token);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  async destroy(req, res) {
    const userId = req.user._id;
    const handle = req.user.handle;

    try {
      console.log("ID", handle);

      await deleteUser(handle);

      res.send({ message: "User successfully deleted" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  },
  async login(req, res) {
    const { email, password } = req.body;
    console.log("name--", email);
    const handle = "handle";
    const errors = {};
    try {
      if (validator.isUndefined(email, password, errors)) {
        return res.status(400).json(errors);
      }
      if (validator.validateUser(email, password, handle, errors)) {
        return res.status(400).json(errors);
      }
      if (!emailValidator.validate(email)) {
        return res.status(403).send({ email: "Not a valid email" });
      }

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(400).send({ general: "Wrong credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res
          .status(400)
          .send({ general: "Password does not match username" });
      }

      user.password = undefined;
      const token = jwtSignUser(user);

      console.log("token", token);

      console.log("user", user);

      res.status(200).send({ token });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  },
};
