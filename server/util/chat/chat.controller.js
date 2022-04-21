const Chat = require("../../models/chat");
const User = require("../../models/user");
const Conversation = require("../../models/conversation");
const ConversationRelation = require("../../models/conversationRelation");
const {
  getChatNotifications,
} = require("../Notifications/chatNotifications.actions");
const { newChat } = require("./chat.utils");
const user = require("../../models/user");

const handleChat = async (io, msg) => {
  const {
    message,
    senderId,
    userHandle,
    profileImage,
    time,
    type,
    toId,
    chatType,
    conversation_id,
  } = msg;

  let conversation = {};

  if (!conversation_id || conversation_id === "") {
    const name = "",
      profileImage = "";

    conversation = await createConversation(
      name,
      profileImage,
      "private",
      toId,
      senderId
    );

    await addUserToConversation(senderId, conversation._id, chatType);

    await addUserToConversation(toId, conversation._id, chatType);
  } else {
    conversation = await Conversation.findById(conversation_id);
  }

  createChat(msg, conversation._id);

  const modified = await updateConversation(conversation._id);

  const users = await getUsersFromConversation(conversation._id);

  return { users, conversation_id: conversation._id, modified };
};

/**
 * @param {string} senderId
 * @param {string} receiverId
 * @param {"private" | "group" | undefined} type
 */
const findConversation = async (senderId, receiverId, type) => {
  const senderConv = await ConversationRelation.find({
    user_id: senderId,
    // type: type || "",
  }).populate("conversation");

  if (senderConv.length < 1) {
    console.log("No conversation has been created");
    return { noConv: "No conversation has been created" };
  }

  const receiverConv = await ConversationRelation.find({
    user_id: receiverId,
    // type: type || "",
  });

  if (receiverConv.length < 1) {
    console.log("No conversation has been created");
    return { noConv: "No conversation has been created" };
  }

  for (let i = 0; i < senderConv.length; i++) {
    for (let j = 0; j < receiverConv.length; j++) {
      if (
        String(senderConv[i].conversation._id) ===
        String(receiverConv[j].conversation._id)
      ) {
        console.log("FOUND", senderConv[i].conversation);
        return senderConv[i].conversation;
      }
    }
  }

  throw Error("Could not find conversation relaton. Something went wrong");
};

const createConversation = async (name, picture, type, toId, senderId) => {
  const user1 = type === "private" ? await User.findById(senderId) : null;
  const user2 = type === "private" ? await User.findById(toId) : null;

  const conversation = await Conversation.create({
    name: name || "",
    picture: { url: picture || "", key: "" },
    type,
    users: { user1: user1._id, user2: user2._id },
  });

  return conversation;
};

const addUserToConversation = async (userId, convId, type) => {
  const convExists = await ConversationRelation.findOne({
    user_id: userId,
    conversation: convId,
  });

  if (convExists) {
    const msg = "User is already in conversation!";
    console.log(msg);
    return { error: msg };
  }

  const conversationRel = new ConversationRelation({
    user_id: userId,
    conversation: convId,
    type,
  });

  conversationRel.save((err, doc) => {
    if (err) return { error: err.message };

    ConversationRelation.findOne({ _id: doc._id })
      .populate({ path: "conversation", model: "Conversation" })
      .populate({ path: "user_id", model: "User" })
      .exec((err, doc) => {
        return doc;
      });
  });
};

const createChat = (msg, convId) => {
  const chat = newChat(msg, convId);

  chat.save((err, doc) => {
    if (err) return { error: err.message };

    Chat.findOne({ _id: doc._id })
      .populate("conversation")
      .exec(async (err, doc) => {
        if (err) throw err;
        const conversation_id = doc.conversation._id;
        const conversation = await Conversation.findByIdAndUpdate(
          conversation_id,
          { modified: Date.now() }
        );

        await conversation.save();

        return doc;
      });
  });
};

const getUsersFromConversation = async (convId) => {
  const userIds = await ConversationRelation.find({
    conversation: convId,
  });

  return userIds;
};

const updateConversation = async (conversationId) => {
  const modified = Date.now();
  const conversation = await Conversation.findByIdAndUpdate(conversationId, {
    modified: modified,
  });

  return modified;
};

/**
 * @param {SocketIO.Server} io
 * @param {string} conversation_id
 * @param {object} msg
 */
const sendChat = (io, conversation_id, msg) => {
  io.to(conversation_id).emit("receive-message", {
    // receiver: userId,
    message: msg.message,
    profileImage: msg.profileImage,
    time: msg.time,
    type: msg.type,
    senderId: msg.senderId,
    conversationId: conversation_id,
    userHandle: msg.userHandle,
  });
};

const getConversationsDetails = async (user_id, userHandle) => {
  const conversations = await ConversationRelation.find({ user_id })
    .populate("conversation")
    .select("conversation");

  if (!conversations || conversations.length === 0) {
    return [];
  }

  const data = [];

  await Promise.all(
    conversations.map(async (conversationRel) => {
      const conversation = conversationRel.conversation;

      if (conversation.type === "private") {
        await conversation
          .populate("users.user1")
          .populate("users.user2")
          .execPopulate();
      }

      const user =
        conversation.type === "private"
          ? userHandle === conversation.users.user1.handle
            ? conversation.users.user2
            : conversation.users.user1
          : "";

      console.log("userid for chat notification: ", conversation._id);
      const unreadMessages = await getChatNotifications(
        user_id,
        conversation._id
      );

      const packet = {
        chats: [],
        conversationId: conversation._id,
        name: conversation.name,
        modified: conversation.modified || 0,
        unreadMessages: unreadMessages || 0,
        type: conversation.type,
        userHandle: user.handle,
        profileImage:
          conversation.type === "private"
            ? user.userDetail.credentials.profilePicture.url
            : conversation.picture.url,
      };

      data.push(packet);
    })
  );

  console.log("data: ", data);
  return data;
};

module.exports = {
  handleChat,
  sendChat,
  findConversation,
  getUsersFromConversation,
  getConversationsDetails,
};
