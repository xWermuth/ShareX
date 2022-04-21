const { newChat } = require("../util/chat/chat.utils");
const { handleChat, sendChat } = require("../util/chat/chat.controller");
const { handleNotifications } = require("./notification.socketIO");
const {
  sendNotificationToUsers,
} = require("../util/Notifications/notifySocket");

/** 5f902e77c7d89119ecb9c736
 * @param {Promise<typeof import("mongoose")>} connect
 */
const handleChatSocketIO = (io, connect) => {
  io.on("connection", (socket) => {
    const id = socket.handshake.query.id;

    if (id) {
      console.log("User joined conversation room: ", id);
      socket.join(id);
    }

    // handleNotifications(io, socket, connect, id);

    socket.on("send-message", (msg) => {
      connect.then(async (db) => {
        try {
          const { users, conversation_id, modified } = await handleChat(
            io,
            msg
          );

          if (!id) {
            socket.join(conversation_id);
            console.log("User joined conversation room: ", conversation_id);
          }

          sendChat(io, conversation_id, msg);

          const response = {
            senderId: msg.senderId,
            toId: msg.toId,
            conversationId: conversation_id,
            chatType: msg.chatType,
            userHandle: msg.userHandle,
            profileImage: msg.profileImage,
            modified,
          };

          await sendNotificationToUsers(response, users, io);
        } catch (error) {
          console.log(error);
        }
      });
    });

    socket.on("leave-conversation", ({ conversation_id }) => {
      console.log("user left conversation: ", conversation_id);
      socket.leave(conversation_id);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = {
  handleChatSocketIO,
};
