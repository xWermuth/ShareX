// MODELS
const User = require("../models/user");
const Scream = require("../models/scream");
const Comment = require("../models/comment");
const Followers = require("../models/follower");

const mongoose = require("mongoose");

// SERVER
const server = require("../services/fileUpload");
const singleUpload = server.uploadScream.single("image");

//UTIL
const helperFunctions = require("../util/helperFunctions");
const mapModelToIndex = require("../util/fetchAsyncInLoop").getMappedItem;

//Notification
const deleteAllNotifcationsAssociatedScream =
  require("../util/notification").deleteAllNotifcationsAssociatedScream;
const createNotification = require("../util/notification").notifyOnAction;

// Pagination
const config = require("../config");

module.exports = {
  async create(req, res) {
    const { body } = req.body;
    const userId = req.user._id;

    try {
      //   user.photos.push({ url, name, discription });

      const user = await User.findById({ _id: userId });

      if (!user) {
        res.status(404).send({ error: "User does not exist" });
        return;
      }

      if (body === undefined) {
        res.status(400).send({ error: "Scream must not be empty!" });
        return;
      }
      if (body.trim() === "") {
        res.status(400).send({ error: "Scream must not be empty!" });
        return;
      }

      if (body.length > 150) {
        res
          .status(400)
          .send({ error: "Scream can't be more than 150 characters" });
        return;
      }

      const scream = await Scream.create({
        body,
        userHandle: user.handle,
        createdAt: new Date(Date.now()),
        profilePhotoUrl: user.userDetail.credentials.profilePicture.url,
      });

      res.status(200).json(scream);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  },
  async uploadFileToScream(req, res) {
    const userId = req.user._id;
    const { postDiscription, imageUrl } = req.body;

    try {
      const user = await User.findById(userId);

      const scream = await Scream.findOne({ userHandle: user.handle });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  async getAllScreams(req, res) {
    const { offset = 0 } = req.query;

    const pagination_options = {
      offset,
      limit: config.LIMIT,
      sort: { createdAt: -1 },
    };

    try {
      const data = await Scream.paginate(
        {},
        pagination_options,
        (err, result) => {
          if (err)
            return res
              .status(501)
              .send({ error: "Could not paginate screams: " + err.message });
          const newResult = result.docs.map(async (scream) => {
            const user = await User.findOne({ handle: scream.userHandle });
            if (user && user.userDetail.credentials.privacy) {
              return await scream;
            }
          });

          // result.docs = newResult;

          return result;
        }
      );

      if (!data) {
        res.status(404).send({ message: "No screams have been posted" });
        return;
      }

      res.status(200).send({ screams: data });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  async getScream(req, res) {
    const screamId = req.params.screamId;
    const { offset = 0 } = req.query;

    const pagination_options = {
      offset,
      limit: config.COMMENT_LIMIT,
      sort: { createdAt: "descending" },
    };

    try {
      const scream = await Scream.findById({ _id: screamId });

      if (!scream) {
        res.status(404).send({ error: "Scream not found!" });
      }

      let data = { scream };

      const comments = await Comment.paginate(
        { screamId: screamId },
        pagination_options
      );
      // const comments = await Comment.find({ screamId });

      data.comments = comments;

      res.status(200).send(data);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  async getScreamsFromFollowers(req, res) {
    const userHandle = req.user.handle;
    const { offset = 0 } = req.query;
    const pagination_options = {
      offset,
      limit: config.LIMIT,
      sort: { createdAt: -1 },
    };

    const resources = { following: "$following" };

    try {
      const followers = await Followers.find({ follower: userHandle });

      let ids = followers.map(function (ele) {
        return mongoose.Types.ObjectId(ele.following_id);
      });

      if (!followers) {
        return res.status(404).send({ error: "No followers found" });
      } else if (followers.length === 0) {
        return res.status(404).send({
          error:
            "You are not following anyone! Explorer users in the forYouPage",
        });
      }

      const screams = await Scream.paginate(
        { user_id: { $in: ids } },
        pagination_options
      );

      if (!screams) return res.status(404).send({ error: "Screams not found" });

      res.status(200).send(screams);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  async delete(req, res) {
    const userHandle = req.user.handle;
    const { screamId } = req.params;

    try {
      const scream = await Scream.findById({ _id: screamId });

      const user = await User.findById({ _id: req.user._id });

      if (!scream) {
        res.status(404).send({ error: "Scream does not exist" });
        return;
      }

      if (scream.userHandle !== userHandle) {
        res.status(403).send({ error: "You are not authorized to delete" });
        return;
      }

      server.deleteObj(scream.postContent._key);

      await Scream.deleteOne({ _id: screamId });

      await helperFunctions.deleteAllCommentsAssociatedScream(screamId);
      await helperFunctions.deleteAllLikesAssociatedScream(screamId);
      await deleteAllNotifcationsAssociatedScream(screamId);

      user.userDetail.credentials.posts--;
      await user.save();

      res.status(200).send({ deleted: "Scream deleted successfully" });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  async createtwo(req, res) {
    const userId = req.user._id;

    try {
      const user = await User.findById({ _id: userId });

      singleUpload(req, res, async function (err) {
        let { body } = req.body;

        if (!user) {
          return res.status(404).send({ error: "User does not exist" });
        }

        if (body === undefined) {
          res.status(400).send({ error: "Scream must not be empty!" });
          return;
        }
        if (body.trim() === "") {
          res.status(400).send({ error: "Scream must not be empty!" });
          return;
        }

        if (body.length > 500) {
          res
            .status(400)
            .send({ error: "Scream can't be more than 150 characters" });
          return;
        }

        if (err) {
          return res.status(422).send({
            fileError: err.message,
          });
        }

        const scream = await Scream.create({
          body,
          userHandle: user.handle,
          user_id: userId,
          createdAt: new Date(Date.now()),
          profilePhotoUrl: user.userDetail.credentials.profilePicture.url,
          postContent: {
            url: req.file.location,
            _key: req.file.key,
            type: req.file.mimetype,
          },
        });

        const followers = await Followers.find({ following: user.handle });

        const params = { body, screamId: scream._id, _id: scream._id };
        const type = "scream";

        user.userDetail.credentials.posts++;
        await user.save();

        followers.forEach(async (follower) => {
          await createNotification(
            params,
            user.handle,
            follower.follower,
            user.userDetail.credentials.profilePicture.url,
            req.file.location,
            type
          );
        });

        res.status(200).send(scream);
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};
