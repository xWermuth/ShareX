const User = require("../../models/user");
const ChatNotification = require("../../models/chatNotification");

/**
 * @param {any} userId
 */
const getUsersToNotify = async (userId) => {
  const users = await User.find({ _id: userId });

  if (!users || users.length === 0) {
    return { error: "No users were found" };
  }

  return { users };
};

const createNotification = async (response, recipientId, conversationId) => {
  const created = Date.now();

  const _notification = await ChatNotification.findOne({
    recipientId,
    conversationId,
  });

  if (!_notification) {
    const notification = await ChatNotification.create({
      senderId: response.senderId,
      recipientId,
      conversationId,
      unreadMessages: 1,
      read: false,
      createdAt: created,
    });

    if (!notification) {
      return { error: "Could not create notification" };
    }

    return notification;
  }

  _notification.unreadMessages++;
  await _notification.save();

  return _notification;
};

/**
 * @param {object} response
 * @param {any[]} users
 */
const sendNotificationToUsers = async (response, users, io) => {
  if (response.chatType === "private") {
    const notification = await createNotification(
      response,
      response.toId,
      response.conversationId
    );

    if (notification.error) {
      console.error("Could not send notification: ", notification.error);
      return;
    } else {
      const data = {};
      data.read = notification.read;
      data.recipientId = notification.recipientId;
      data.senderId = notification.senderId;
      data.unreadMessages = notification.unreadMessages;
      data.conversationId = notification.conversationId;

      data.senderId = response.senderId;
      data.userHandle = response.userHandle;
      data.chatType = response.chatType;
      data.modified = response.modified;
      data.profileImage = response.profileImage;

      return io.emit(response.toId).emit("receive-notification", data);
    }
  }

  users.forEach(async (user) => {
    const recipient_id = user.user_id;

    if (String(response.senderId) !== String(recipient_id)) {
      const notification = await createNotification(
        response,
        recipient_id,
        response.conversationId
      );

      if (notification.error) {
        console.error("Could not send notification: ", notification.error);
      } else {
        io.emit(recipient_id).emit("receive-notification", notification);
      }
    }
  });
};

module.exports = { getUsersToNotify, sendNotificationToUsers };
