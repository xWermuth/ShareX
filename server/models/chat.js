const { model, Schema } = require("mongoose");

const chatSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User" },
    message: {
      type: String,
    },
    type: { type: String },
    profileImage: { type: String },
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
    time: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Chat", chatSchema);
