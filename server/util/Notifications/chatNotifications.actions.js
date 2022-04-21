const ChatNotification = require("../../models/chatNotification");

const getChatNotifications = async (recipientId, conversationId) => {
  const notification = await ChatNotification.findOne({
    recipientId,
    conversationId,
  });

  if (!notification) {
    console.error("Could not find chat notification");
    return 0;
  }

  return notification.unreadMessages;
};

const readChatNotifications = async (senderId, conversationId) => {
  if (!conversationId) return { error: "No conversations were found" };

  await ChatNotification.findOneAndUpdate(
    { recipientId: senderId, conversationId },
    {
      unreadMessages: 0,
    },
    (error, result) => {
      if (error) throw Error(error);

      return result;
    }
  );
};

module.exports = { getChatNotifications, readChatNotifications };
