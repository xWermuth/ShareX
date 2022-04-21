const {
  sendNotificationToUsers,
} = require("../util/Notifications/notifySocket");
const { getUsersFromConversation } = require("../util/chat/chat.controller");

/** 5f902e77c7d89119ecb9c736
 * @param {SocketIO.Server} io
 * @param {Promise<typeof import("mongoose")>} connect
 */
const handleNotifications = async (io, socket, connect, userId) => {
  socket.on("send-chat-notification", (response) => {
    connect.then(async (db) => {
      try {
        const users = await getUsersFromConversation(response.conversationId);

        await sendNotificationToUsers(response, users, io);
      } catch (error) {
        console.error("error: ", error);
      }
    });
  });
};

module.exports = { handleNotifications };
