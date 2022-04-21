const Scream = require("../models/scream");
const Like = require("../models/like");
const Comment = require("../models/comment");
const User = require("../models/user");

//util
const notifyOnLike = require("./notification").notifyOnAction;
const destroyNotifyOnUnlLike = require("./notification").destroyNotification;

const MyError = require("../middleware/error");

const likeUnlike = async (user, screamId, res) => {
  // try {
  const scream = await Scream.findById({ _id: screamId });

  if (!user) {
    res.status(404).send({ message: "User not found" });
    return;
  } else if (!scream) {
    throw new MyError(404, "User not found");
  }

  const like = await Like.findOne({ userHandle: user.handle, screamId });

  if (!like) {
    const like = await Like.create({
      userHandle: user.handle,
      screamId,
    });
    scream.likeCount++;
    await scream.save();

    let isLiking = true;
    addRemoveLikeFromUser(user._id, screamId, isLiking, scream.userHandle);

    const message = {};
    const type = "like";
    message.notifications = await notifyOnLike(
      like,
      user.handle,
      scream.userHandle,
      scream.profilePhotoUrl,
      scream.postContent.url,
      type
    );

    message.like = like;
    message.reducer = "like";
    message.scream = scream;

    return message;
  } else {
    const like = await Like.findOneAndDelete({
      userHandle: user.handle,
      screamId,
    });
    scream.likeCount--;

    await scream.save();

    let isLiking = false;
    addRemoveLikeFromUser(user._id, screamId, isLiking, scream.userHandle);

    let message = {};
    message.notification = await destroyNotifyOnUnlLike(like);

    message.like = like;
    message.reducer = "unlike";
    message.scream = scream;

    return message;
  }
};

const deleteAllLikesAssociatedScream = async (screamId) => {
  await Like.deleteMany({ screamId }, function (err, result) {
    if (err) {
      throw new MyError(404, "Scream id not found");
    } else {
      console.log(result);
    }
  });
};

const deleteAllCommentsAssociatedScream = async (screamId) => {
  await Comment.deleteMany({ screamId }, function (err, result) {
    if (err) {
      throw new MyError(404, "Scream id not found");
    } else {
      console.log(result);
    }
  });
};

const addRemoveLikeFromUser = async (
  userId,
  screamId,
  isLiking,
  userHandle
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new MyError(404, "Could not find user");
  }
  if (isLiking) {
    await user.userDetail.credentials.likes.push({
      userHandle,
      screamId,
    });
  } else {
    let removeIndex = await user.userDetail.credentials.likes
      .map(function (item) {
        return item.screamId;
      })
      .indexOf(screamId);

    await user.userDetail.credentials.likes.splice(removeIndex, 1);
  }
  await user.save();
};

module.exports = {
  likeUnlike,
  deleteAllLikesAssociatedScream,
  deleteAllCommentsAssociatedScream,
};
