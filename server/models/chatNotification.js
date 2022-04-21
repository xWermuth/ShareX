const { Schema, model } = require("mongoose");

const chatNotificaitonSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User" },
    recipientId: { type: Schema.Types.ObjectId, ref: "User" },
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
    unreadMessages: { type: Number, default: 0 },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true, collection: "chatNotifications" }
);

module.exports = model("chatNotifications", chatNotificaitonSchema);
