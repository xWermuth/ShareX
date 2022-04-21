const mongoose = require("mongoose");
//MODELS
const Access = require("../models/access");
const Notification = require("../models/notification");

const requestFollowAccess = async (requester, receiver, notificationId) => {
  const _id = mongoose.Types.ObjectId(notificationId);
  const requestAccess = await Access.create({
    requester,
    receiver,
    notificationId: _id,
    isRequesting: true,
  });

  if (!requestAccess) throw new Error("Could not request access!");
};

const removeAccess = async (requester, receiver) => {
  const temp = await Access.findOneAndDelete({ requester, receiver });
  if (!temp || !temp.isRequesting) {
    return false;
  }
  return true;
};

const grantFollowAccess = async (notificationId) => {
  const _id = mongoose.Types.ObjectId(notificationId);
  const access = await Access.findOne({ notificationId: _id });

  if (!access) {
    throw new Error("Could not find access");
  }

  access.grantedAccess = true;
  access.isRequesting = false;
  await access.save();

  const notification = await Notification.findByIdAndDelete({
    _id,
  });

  console.log("---++++", _id);

  if (!notification) {
    throw new Error("Could not delete notification");
  }
};

const denyFollowAccess = async (_notificationId) => {
  console.log("REACHED", _notificationId);
  const notificationId = mongoose.Types.ObjectId(_notificationId);
  const access = await Access.findOneAndDelete({ notificationId });
  console.log("acces", access);
  if (!access) {
    throw new Error("Could not find access");
  }

  const notification = await Notification.findByIdAndDelete({
    _id: notificationId,
  });

  if (!notification) {
    throw new Error("Notification Already Deleted");
  }
};

const alreadyRequested = async (requester, receiver) => {
  console.log("params", requester, receiver);
  const access = await Access.findOne({ requester, receiver });

  console.log("here----, already requested");

  if (access) {
    return { alreadyExists: true, isRequesting: access.isRequesting };
  } else {
    return { alreadyExists: false };
  }
};

module.exports = {
  requestFollowAccess,
  grantFollowAccess,
  denyFollowAccess,
  removeAccess,
  alreadyRequested,
};
