const User = require("../models/user");
const Comment = require("../models/comment");
const Scream = require("../models/scream");
const Notification = require("../models/notification");

// SERVER
const server = require("../services/fileUpload");

const singleUpload = server.uploadProfilePic.single("image");

//Util
const validator = require("../util/validators");

module.exports = {
  async show(req, res) {
    const userId = req.user._id;

    const { photoId } = req.params;

    console.log(photoId);
    try {
      const user = await User.findById(userId);

      let temp;
      user.photos.forEach((photo) => {
        if (photo._id == photoId) {
          temp = photo;
        }
      });

      res.send(temp);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  async index(req, res) {
    const userId = req.user._id;
    try {
      const user = await User.findById(userId);
      res.send(user.photos);
    } catch (error) {
      res.status(400).send({ error: err.message });
    }
  },

  async images(req, res) {
    const userId = req.user._id;
    try {
      const user = await User.findById(userId);
      res.send(user.photos);
    } catch (error) {
      res.status(400).send({ error: err.message });
    }
  },

  async uploadProfilePicture(req, res) {
    console.log("HELLO");
    const userId = req.user._id;

    const userHandle = req.user.handle;
    const profilePictureBefore =
      req.user.userDetail.credentials.profilePicture.url;

    //TODO put this function in its own document-----------

    try {
      singleUpload(req, res, async function (err) {
        if (err) {
          return res.status(422).send({
            errors: [{ title: "File Upload Error", detail: err.message }],
          });
        } else if (!validator.validateMimeType(req.file.mimetype)) {
          return res
            .status(400)
            .send({ error: "Wrong file type, " + req.file.mimetype + "" });
        }

        if (
          req.file.mimetype === "video/mp4" ||
          req.file.mimetype === "video/MOV"
        ) {
          return res
            .status(400)
            .send({ error: "Wrong file type, " + req.file.mimetype + "" });
        }

        await User.findById(userId, async function (err, user) {
          if (err) {
            res.status(400).send({ error: err });
          }

          if (user.userDetail.credentials.profilePicture._key !== "KEY") {
            server.deleteObj(user.userDetail.credentials.profilePicture._key);
          }
          console.log(user);
          user.userDetail.credentials.profilePicture.url = req.file.location;
          user.userDetail.credentials.profilePicture._key = req.file.key;
          user.save();

          const profilePictureAfter = req.file.location;

          if (profilePictureBefore !== profilePictureAfter) {
            await Comment.updateMany(
              { userHandle },
              { imageUrl: profilePictureAfter },
              { new: true }
            );

            console.log("Profile picture successfully updated for comments");

            await Scream.updateMany(
              { userHandle },
              { profilePhotoUrl: profilePictureAfter },
              { new: true }
            );

            await Notification.updateMany(
              { sender: userHandle },
              { profilePicture: profilePictureAfter },
              { new: true }
            );
          }
        });

        res.status(200).send({ message: "Image uploaded succesfully" });
      });
    } catch (err) {
      res.status(400).send({ message: err.message });
      // next(err);
    }
  },

  async deleteProfilePicture(req, res) {
    const userId = req.user._id;

    try {
      const user = await User.findById(userId);

      console.log("SERVER KEY", user.profilePicture._key);
      server.deleteObj(user.profilePicture._key);

      user.userDetail.credentials.profilePicture.url =
        process.env.DEFAULT_PROFILE_PICTURE;

      user.userDetail.credentials.profilePicture._key = "KEY";

      user.save();

      res.send({ message: "Profile picture deleted!" });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  },
  async testing(req, res) {
    const userId = req.user._id;

    const followed_user = await User.findById(userId).followedUser;

    const images = await User.find({ _id: followed_user }).select("images");

    let arr = [];

    images.forEach((element) => {
      arr.push(element);
    });
  },

  async uploadPictureToScream(req, res) {
    const userId = req.user._id;
    var { screamId } = req.params;

    console.log("---", req.params);
    try {
      singleUpload(req, res, async function (err) {
        console.log("---", screamId);
        if (err) {
          return res.status(422).send({
            errors: [{ title: "File Upload Error", detail: err.message }],
          });
        } else if (!validator.validateMimeType(req.file.mimetype)) {
          return res
            .status(400)
            .send({ error: "Wrong file type, " + req.file.mimetype + "" });
        }

        const scream = await Scream.findById({ _id: screamId });

        if (!scream) {
          res.status(404).send({ error: "Scream does not exist" });
        }

        const serverKeyBefore = scream.postContent._key;

        if (serverKeyBefore !== undefined) {
          server.deleteObj(serverKeyBefore);
        }

        scream.postContent.url = req.file.location;
        scream.postContent._key = req.file.key;
        scream.postContent.type = req.file.mimetype;

        await scream.save();

        // if (req.file.mimetype === "video/mp4") {
        //   console.log("---", req.file.duration);

        //   // const video = loadVideo(req.file);

        //   const video = document.createElement("video");
        //   video.src = file.req.location;

        //   console.log("video duration: " + video.duration);
        // }

        res.status(200).send(req.file.location);
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  },
  async destroy(req, res) {
    const userId = req.user._id;
    const { photoId } = req.params;

    try {
      const user = await User.findById(userId);

      const photos = await user.photos.pull({ _id: photoId });

      console.log("SERVER KEY", photos[0].key);

      server.deleteObj(photos[0].key);

      await user.save();

      res.send({ message: "photo successfully deleted" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  },
};

const loadVideo = (file) =>
  new Promise((resolve, reject) => {
    try {
      console.log(file);
      let video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        resolve(this);
      };

      video.onerror = function () {
        reject("Invalid video. Please select a video file.");
      };

      video.src = window.URL.createObjectURL(file);
    } catch (e) {
      reject(e);
    }
  });
