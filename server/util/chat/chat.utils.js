const Chat = require("../../models/chat");

// msg content:
// message,
// senderId,
// userHandle,
// profileImage,
// time,
// type,
// toId,
// chatType,

const newChat = (msg, convId) => {
  return new Chat({
    senderId: msg.senderId,
    message: msg.message,
    conversation: convId,
    type: msg.type,
    profileImage: msg.profileImage,
    time: msg.time,
  });
};

function sortByDate(a, b) {
  // @ts-ignore
  return new Date(b.modified) - new Date(a.modified);
}

module.exports = { newChat, sortByDate };
