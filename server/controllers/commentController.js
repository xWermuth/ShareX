const User = require("../models/user");
const Comment = require("../models/comment");
const Scream = require("../models/scream");

//utils
const validator = require("../util/validators");
const notifyOnComment = require("../util/notification").notifyOnAction;
const destroyNotification = require("../util/notification").destroyNotification;

// Config
const CONFIG = require("../config");

module.exports = {
  async commentOnScream(req, res) {
    const userId = req.user._id;
    const { body, screamId } = req.body;

    if (validator.isEmpty(body)) {
      return res.status(400).send({ error: "Must not be empty " });
    }

    if (body.length > 300) {
      return res
        .status(400)
        .send({ error: "Cannot be longer than 300 characters" });
    }

    try {
      const user = await User.findById({ _id: userId });
      if (!user) {
        res.status(404).send({ error: "User does not exist" });
      }

      const profilePicture = user.userDetail.credentials.profilePicture.url;

      console.log("profilePicture", profilePicture);
      const comment = await Comment.create({
        userHandle: user.handle,
        screamId,
        body,
        imageUrl: profilePicture,
        createdAt: new Date(Date.now()),
      });

      const scream = await Scream.findByIdAndUpdate(
        { _id: screamId },
        { $inc: { commentCount: 1 } }
      );

      if (!scream) {
        res.status(404).send({ error: "Scream does not exist" });
      }

      let message = {};
      const type = "comment";
      message.notification = await notifyOnComment(
        comment,
        user.handle,
        scream.userHandle,
        scream.profilePhotoUrl,
        scream.postContent.url,
        type
      );

      scream.commentCount++;

      message.comment = comment;
      message.scream = scream;

      res.status(200).send(message);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  async getComment(req, res) {
    const { offset = 0 } = req.query;
    const { screamId } = req.params;

    console.log("---screamId", screamId);

    const pagination_options = {
      offset,
      limit: CONFIG.COMMENT_LIMIT,
      sort: { createdAt: "descending" },
    };

    try {
      const comments = await Comment.paginate(
        { screamId: screamId },
        pagination_options
      );
      console.log("comments--", comments);

      res.status(200).send(comments);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  async destroy(req, res) {
    const commentId = req.params.commentId;
    const userHandle = req.user.handle;

    try {
      const comment = await Comment.findById({ _id: commentId });

      if (!comment) {
        res.status(404).send({ error: "Comment does not exist" });
      }

      if (comment.userHandle !== userHandle) {
        res
          .status(403)
          .send({ error: "You do not have permission to delete this comment" });
      }

      await Comment.deleteOne({ _id: commentId });

      await Scream.findByIdAndUpdate(
        { _id: comment.screamId },
        { $inc: { commentCount: -1 } }
      );

      let message = {};
      message.notification = await destroyNotification(comment);

      message.comment = comment;

      res.status(200).send(message);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
};
