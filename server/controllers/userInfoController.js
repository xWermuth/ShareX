//Models
const User = require("../models/user");
const Scream = require("../models/scream");
const Follower = require("../models/follower");
const Bookmark = require("../models/bookmark");
const Access = require("../models/access");
const Notification = require("../models/notification");

//Util
const validator = require("../util/validators");
const getNotifications = require("../util/notification").getNotifications;
const getNotificationsAmount = require("../util/notification")
  .getAmoutOfUnreadNotifications;
const createNotification = require("../util/notification").notifyOnAction;
const {
  getFollowing,
  followUser,
  alreadyFollowing,
  getOneFollowing,
} = require("../util/followers");
const { getConversationsDetails } = require("../util/chat/chat.controller");
const getUserInfo = require("../util/getUserInfo").getUserInfo;
const removeAccess = require("../util/AccessHelper").removeAccess;
const _grantFollowAccess = require("../util/AccessHelper").grantFollowAccess;
const _denyFollowAccess = require("../util/AccessHelper").denyFollowAccess;
const alreadyRequestedFollow = require("../util/AccessHelper").alreadyRequested;

module.exports = {
  // async deleteAllFollowing(req, res) {
  //   try {
  //     await Access.deleteMany({});
  //     await Follower.deleteMany({});

  //     res.status(200).send({ Message: "Successfully deleted all followers" });
  //   } catch (error) {
  //     res.status(500).send({ error });
  //   }
  // },

  async addUserDetails(req, res) {
    const userId = req.user._id;
    const { privacy } = req.body;

    const detailsValidator = validator.reduceUserDetails(req.body);

    if (detailsValidator.valid) {
      var userInfo = detailsValidator.userDetails;
    } else {
      res.status(400).send({ error: detailsValidator.errors });
      return;
    }

    try {
      await User.findByIdAndUpdate(userId, { upsert: true }, function (
        err,
        user
      ) {
        if (err) {
          res.status(400).send({ err: err.message });
        }

        user.userDetail.credentials.userInfo = userInfo;
        user.userDetail.credentials.privacy = privacy;

        user.save();
      });

      res.status(200).send({ message: "User updated successfully" });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  async getAuthenticatedUser(req, res) {
    const userId = req.user._id;
    const userHandle = req.user.handle;
    const { offset } = req.query;

    try {
      const user = await User.findById(userId);

      if (!user) {
        res.status(400).send({ error: "User does not exist" });
        return;
      }

      const userDetails = {};
      userDetails._id = userId;

      userDetails.userDetail = user.userDetail;

      const notifications = await getNotifications(user, offset);

      // @ts-ignore
      userDetails.notifications = notifications.notifications;

      userDetails.following = await getFollowing(user.handle, userId);
      userDetails.numberOfUnreadNotifications = await getNotificationsAmount(
        user.handle
      );

      userDetails.conversations = await getConversationsDetails(
        userId,
        userHandle
      );

      userDetails.bookmarks = await Bookmark.find(
        { userHandle: user.handle },
        { screamId: 1, url: 1, screamHandle: 1, _id: 0 }
      );

      res.status(200).send(userDetails);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  async getUserDetails(req, res) {
    const userHandle = req.params.handle;
    const requester = req.query.requester;

    try {
      const isSameUser = false;
      const data = await getUserInfo(res, userHandle, requester, isSameUser);

      return data;
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  async getUserDetailsAuthorized(req, res) {
    const authUser = req.user.handle;
    const userHandle = req.params.handle;
    const requester = req.query.requester;
    let isSameUser = false;

    try {
      if (authUser === userHandle) {
        isSameUser = true;
      }

      const data = await getUserInfo(res, userHandle, requester, isSameUser);

      return data;
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  async addFollowers(req, res) {
    const userId = req.user._id;
    const userHandle = req.user.handle;
    const { following } = req.body;

    try {
      if (userHandle === following) {
        res.status(400).send({ error: "You cannot follow yourself" });
        return;
      }

      const user_to_follow = await User.findOne({ handle: following });
      const user = await User.findById({ _id: userId });

      if (!user_to_follow || !user)
        return res.status(404).send({ error: "User not found" });

      let message = {};
      message.followersCount = user.userDetail.credentials.followersCount;
      message.followingCount = user.userDetail.credentials.followingCount;

      message.followedUserFollowersCount =
        user_to_follow.userDetail.credentials.followersCount;

      message.followedUserFollowingCount =
        user_to_follow.userDetail.credentials.followingCount;

      message.following = await getOneFollowing(user._id, user_to_follow);

      const isFollowing = await alreadyFollowing(
        userHandle,
        user_to_follow.handle
      );

      if (isFollowing) {
        console.log("Already following user");
        return res.status(400).send(message);
      }

      const hasRequestFollow = await alreadyRequestedFollow(
        userHandle,
        user_to_follow.handle
      );
      console.log("made it his fare");

      if (hasRequestFollow.alreadyExists) {
        message.isRequestingFollow = hasRequestFollow.isRequesting;
        console.log("---HAS ALREADY REQUESTED---");

        return res.status(400).send(message);
      }

      if (user_to_follow.userDetail.credentials.privacy) {
        const params = {};
        const postPicture = "";
        const type = "request_follow";
        await createNotification(
          params,
          userHandle,
          user_to_follow.handle,
          user_to_follow.userDetail.credentials.profilePicture.url,
          postPicture,
          type
        );
        message.isRequestingFollow = true;
        return res.status(200).send(message);
      }

      await followUser(res, userHandle, following, user_to_follow, user);

      res.status(200).send(message);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  async unFollow(req, res) {
    const userId = req.user._id;
    const userHandle = req.user.handle;
    const { unfollow } = req.params;

    console.log("here", unfollow);

    try {
      if (userHandle === unfollow) {
        res.status(400).send({ error: "You cannot follow yourself" });
        return;
      }
      const user = await User.findById({ _id: userId });
      const followedUser = await User.findOne({ handle: unfollow });

      if (!user) {
        res.status(404).send({ error: "User does not exist" });
        return;
      } else if (!followedUser) {
        res
          .status(404)
          .send({ error: "User you try to follow does not exist" });
        return;
      }

      let message = {};
      message.followersCount = user.userDetail.credentials.followersCount;
      message.followingCount = user.userDetail.credentials.followingCount;

      message.followedUserFollowersCount =
        followedUser.userDetail.credentials.followersCount;

      message.followedUserFollowingCount =
        followedUser.userDetail.credentials.followingCount;

      message.following = followedUser.handle;

      const isStillRequstingFollow = await removeAccess(userHandle, unfollow);

      if (isStillRequstingFollow) {
        message.isRequestingFollow = false;
        return res.status(200).send(message);
      }

      const follower = await Follower.findOneAndDelete({
        following: unfollow,
        follower: userHandle,
      });

      if (!follower) {
        return res
          .status(400)
          .send({ error: "You are already unfollowing this person" });
      }

      user.userDetail.credentials.followingCount--;
      followedUser.userDetail.credentials.followersCount--;

      await user.save();
      await followedUser.save();

      res.status(200).send(message);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  async bookmarkScreams(req, res) {
    const handle = req.user.handle;
    const { screamId } = req.body;
    console.log("----", screamId);
    try {
      let bookmark = await Bookmark.findOne({ screamId });

      if (bookmark) {
        res.status(404).send({ error: "Scream already bookmarked" });
        return;
      }

      const scream = await Scream.findById({ _id: screamId });
      if (!scream) {
        res.status(404).send({ error: "Scream no longer exists" });
        return;
      }

      bookmark = await Bookmark.create({
        userHandle: handle,
        screamId,
        url: scream.postContent.url,
        screamHandle: scream.userHandle,
      });

      res.status(200).send(bookmark);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  async removeBookmark(req, res) {
    const handle = req.user.handle;
    const { screamId } = req.params;

    try {
      const bookmark = await Bookmark.findOneAndDelete({
        userHandle: handle,
        screamId,
      });

      if (!bookmark) {
        res.status(404).send({ error: "Bookmark does not exist" });
        return;
      }

      res.status(200).send(screamId);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  async getBookmarks(req, res) {
    const handle = req.user.handle;

    try {
      const bookmarks = await Bookmark.find({ userHandle: handle });

      if (!bookmarks) {
        res.status(404).send({ error: "No bookmark could be found" });
        return;
      }

      const screams = await Promise.all(bookmarks.map(getBookmarkData));

      res.status(200).send(screams);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  async grantFollowAccess(req, res) {
    const userId = req.user._id;
    const user = req.user;
    const userHandle = req.user.handle;
    const { notificationId, following } = req.body;

    try {
      if (!notificationId)
        return res
          .status(403)
          .send({ error: "Missing notifications id param" });

      const test = await _grantFollowAccess(notificationId);

      const user_to_follow = await User.findOne({ handle: following });

      if (!user_to_follow) {
        return res
          .status(404)
          .send({ error: "Could not find user " + following });
      }

      const user = await User.findById({ _id: userId });

      if (!user) {
        return res.status(404).send({ error: "Could not auth user" });
      }

      let message = {};
      message.followersCount = user.userDetail.credentials.followersCount;
      message.followingCount = user.userDetail.credentials.followingCount;

      message.followedUserFollowersCount =
        user_to_follow.userDetail.credentials.followersCount;

      message.followedUserFollowingCount =
        user_to_follow.userDetail.credentials.followingCount;

      message.following = user_to_follow.handle;

      await followUser(res, following, userHandle, user, user_to_follow);

      console.log("here********************************", message);

      res.status(200).send(message);
    } catch (error) {
      console.log("ERROR : ", error);
      res.status(400).send({ error: error.message });
      throw new Error(error.message);
    }
  },
  async denyFollowAccess(req, res) {
    const { notificationId } = req.params;
    try {
      if (!notificationId)
        return res
          .status(403)
          .send({ error: "Missing notifications id param" });

      await _denyFollowAccess(notificationId);
      res.status(200).send({ succes: "Denied follower request" });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
};

async function getBookmarkData(item, index) {
  const screamId = item.screamId;

  const scream = await Scream.findById({ _id: screamId });

  if (!scream) {
    return { error: "Scream does not exist!" };
  }

  return scream;
}
