///util
const Conversation = require("../models/conversation");
const Chat = require("../models/chat");
const ConversationRelation = require("../models/conversationRelation");
const ChatNotification = require("../models/chatNotification");
const { getAllChatsFromConvId } = require("../util/chat/chat.helperFunc");
const {
  readChatNotifications,
} = require("../util/Notifications/chatNotifications.actions");

module.exports = {
  async getPrivateChats(req, res) {
    const conversationId = req.params.convId;

    try {
      const chats = await getAllChatsFromConvId(conversationId);

      console.log("here, ", chats);

      if (chats.error) {
        return res.status(200).send({ chats: [] });
      }

      return res.status(200).send(chats);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  async readChats(req, res) {
    const senderId = req.user._id;
    const { conversationId } = req.body;
    try {
      await readChatNotifications(senderId, conversationId);

      return res.status(200).send({ message: "All chats have been read" });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  async deleteAllConv(req, res) {
    try {
      await ConversationRelation.deleteMany({});
      await Chat.deleteMany({});
      await Conversation.deleteMany({});
      await ChatNotification.deleteMany({});
      res.status(200).send({ message: "All chats have been deleted" });
    } catch (error) {
      res.status(400).send({ error });
    }
  },
};
