const Chat = require("../../models/chat");

/**
 * @param {any} conversation_id
 * @returns {Promise<any[] | object>} }
 */
const getAllChatsFromConvId = async (conversation_id) => {
  const chats = await Chat.find({ conversation: conversation_id });

  console.log("conversation id ", chats);
  if (!chats || chats.length <= 0) {
    return { error: "No chats were found in this conversation" };
  }

  return chats;
};

module.exports = { getAllChatsFromConvId };
