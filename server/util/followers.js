// Models
const User = require("../models/user");
const Follower = require("../models/follower");
const follower = require("../models/follower");
const { findConversation } = require("../util/chat/chat.controller");
const {
  getChatNotifications,
} = require("./Notifications/chatNotifications.actions");
const conversation = require("../models/conversation");

const getFollowing = async (userHandle, followerId) => {
  const following = await Follower.find({ follower: userHandle });

  if (following.length < 1) {
    return [];
  }

  if (!following) {
    throw Error("Something went wrong");
  }

  let data = [];

  await Promise.all(
    following.map(async (follower) => {
      const user = await User.findOne({ handle: follower.following });
      const conversation = await Promise.resolve(
        findConversation(follower.following_id, followerId, undefined)
      );

      const unreadMessages = !conversation._id
        ? 0
        : await getChatNotifications(follower.following_id, conversation._id);

      data.push({
        userHandle: follower.following,
        profileImage: user.userDetail.credentials.profilePicture.url,
        userId: follower.following_id,
        conversationId: conversation._id || "",
        conversationModified: conversation.modified || 0,
        unreadMessages: unreadMessages,
      });
    })
  );

  return data;
};

const getOneFollowing = async (userId, user_to_follow) => {
  let data = {};

  const conversation = await findConversation(
    user_to_follow._id,
    userId,
    undefined
  );

  const unreadMessages = !conversation._id
    ? 0
    : await getChatNotifications(user_to_follow._id, conversation._id);

  data.userHandle = user_to_follow.handle;
  data.profileImage = user_to_follow.userDetail.credentials.profilePicture.url;
  data.userId = user_to_follow._id;
  data.unreadMessages = unreadMessages;
  data.conversationId = conversation._id || "";
  data.conversationModified = conversation.modified || 0;

  return data;
};

const followUser = async (res, userHandle, following, user_to_follow, user) => {
  const follower = await Follower.findOne({
    follower: userHandle,
    following,
    follow_id: user_to_follow._id,
  });
  if (follower) {
    throw new Error(`Already following this user ${follower.following}`);
  }

  await Follower.create({
    follower: userHandle,
    following_id: user_to_follow._id,
    following,
    createdAt: new Date(Date.now()),
  });

  user.userDetail.credentials.followingCount++;
  user_to_follow.userDetail.credentials.followersCount++;

  await user.save();
  await user_to_follow.save();
};

const alreadyFollowing = async (follower, following) => {
  const alreadyFollowing = await Follower.findOne({ follower, following });

  return alreadyFollowing !== null;
};

module.exports = {
  getFollowing,
  followUser,
  alreadyFollowing,
  getOneFollowing,
};
