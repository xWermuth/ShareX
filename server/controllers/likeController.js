// MODELS
const User = require("../models/user");
const Scream = require("../models/scream");
const Comment = require("../models/comment");
const Like = require("../models/like");

//Util functions
const helperFunctions = require("../util/helperFunctions");

module.exports = {
  async likeUnLikeScream(req, res, next) {
    const user = req.user;
    const { screamId } = req.params;

    try {
      const response = await helperFunctions.likeUnlike(user, screamId, res);

      res.status(200).send(response);
    } catch (err) {
      next(err);
      // res.status(400).send({ error:})
    }
  },
};
