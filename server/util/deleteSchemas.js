// Models
const User = require("../models/user");
const Scream = require("../models/scream");
const Comment = require("../models/comment");
const Like = require("../models/like");
const Notification = require("../models/notification");
const Follower = require("../models/follower");
const Bookmark = require("../models/bookmark");

// Server
const server = require("../services/fileUpload");

const deleteScreamObjectsInS3 = async (userHandle) => {
  const screams = await Scream.find({ userHandle });

  screams.forEach((scream) => {
    server.deleteObj(scream.postContent._key);
  });

  await Scream.deleteMany({ userHandle });
};

const removeFollowers = async (userHandle) => {
  const following = await Follower.find({ follower: userHandle });

  following.forEach(async (element) => {
    const user = await User.findOne({ handle: element.following });

    if (user) {
      user.userDetail.credentials.followersCount--;
      await user.save();
    }
  });

  await Follower.deleteMany({ follower: userHandle });
};

const deleteUser = async (userHandle) => {
  const user = await User.findOne({ handle: userHandle });
  const key = user.userDetail.credentials.profilePicture._key;
  server.deleteObj(key);
  await User.deleteOne({ handle: userHandle });
};

const deleteEverythingAssociatedWithUser = async (userHandle) => {
  await Scream.deleteMany({ userHandle: userHandle });
  await Notification.deleteMany({ recipient: userHandle });
  await Comment.deleteMany({ userHandle: userHandle });
  await Like.deleteMany({ userHandle: userHandle });
  await Bookmark.deleteMany({ userHandle: userHandle });

  await deleteUser(userHandle);
  await removeFollowers(userHandle);
  await deleteScreamObjectsInS3(userHandle);
};

module.exports = { deleteEverythingAssociatedWithUser };
