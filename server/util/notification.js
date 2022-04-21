//MODELS
const Notification = require("../models/notification");

//ERROR
const myError = require("../middleware/errorHandler");

// Config file
const config = require("../config/config");
const { Error } = require("mongoose");

// Helpers
const requestAccess = require("./AccessHelper").requestFollowAccess;

const notifyOnAction = async (
  params,
  sender,
  recipient,
  profilePicture,
  postPicture,
  type
) => {
  const notifications = await Notification.create({
    createdAt: new Date(Date.now()),
    sender,
    recipient,
    read: false,
    type,
    screamId: params.screamId ? params.screamId : "",
    id: params._id ? params._id : "",
    profilePicture,
    postPicture: postPicture ? postPicture : "",
  });

  if (!notifications) {
    console.log("could not create notification");
    return { error: "Could not create notification" };
  }

  if (type === "request_follow") {
    console.log("enterd notifications", notifications._id);
    await requestAccess(sender, recipient, notifications._id);
  }

  return notifications;
};

const destroyNotification = async (params) => {
  const notification = await Notification.findOneAndDelete({
    id: params._id,
  });

  if (!notification) {
    return { error: "Could not delete notification" };
  } else {
    return { message: "Notification successfully deleted" };
  }
};

const getNotifications = async (user, offset) => {
  let data = {};
  data.notifications = [];

  const paginate_options = {
    offset,
    limit: 10,
    sort: { createdAt: -1 },
  };

  let notificationsOfUser = await Notification.paginate(
    {
      recipient: user.handle,
    },
    paginate_options
  );

  if (!notificationsOfUser) {
    return ["Could not find notifications"];
  }

  if (notificationsOfUser.docs.length < 1) {
    return ["You have no notifications"];
  }

  notificationsOfUser.docs.forEach((doc) => {
    data.notifications.push({
      recipient: doc.recipient,
      sender: doc.sender,
      type: doc.type,
      createdAt: doc.createdAt,
      read: doc.read,
      screamId: doc.screamId,
      id: doc.id,
      notificationId: doc._id,
      profilePicture: doc.profilePicture,
      postPicture: doc.postPicture,
    });
  });

  delete notificationsOfUser.docs;

  data.paginate_options = notificationsOfUser;

  return data;
};

const markOneAsRead = async (notificationId, userHandle) => {
  const notification = await Notification.findOne({ _id: notificationId });

  if (!notification) {
    throw new Error({ Error: "could not read notification" });
  }

  if (notification.sender !== userHandle) {
    throw new Error({
      unauthorized: "You dont have permission to read notifications",
    });
  }

  notification.read = true;
  await notification.save();

  return notification;
};

const markAllAsRead = async (userHandle) => {
  const notification = await Notification.updateMany(
    { recipient: userHandle },
    { read: true },
    { new: true }
  );

  console.log("HERE", notification);

  if (!notification) {
    throw new Error({ Error: "could not read notification" });
  }

  return notification;
};

const deleteAllNotifcationsAssociatedScream = async (screamId) => {
  await Notification.deleteMany({ screamId }, function (err, result) {
    if (err) {
      throw new Error(err);
    } else {
      console.log(result);
    }
  });
};

const getAmoutOfUnreadNotifications = async (userHandle) => {
  const notifications = await Notification.find({
    recipient: userHandle,
    read: false,
  });

  console.log("notifications-----", notifications);

  if (notifications.length < 1) {
    return 0;
  }

  if (!notifications) {
    throw new MyError(404, "Could not find notifications");
  }

  return notifications.length;
};

module.exports = {
  notifyOnAction,
  destroyNotification,
  getNotifications,
  markOneAsRead,
  markAllAsRead,
  deleteAllNotifcationsAssociatedScream,
  getAmoutOfUnreadNotifications,
};
