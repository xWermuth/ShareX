const { model, Schema } = require("mongoose");

const conversationRelationSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
    type: { type: String, default: "private" },
    time: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

module.exports = model("ConversationRelation", conversationRelationSchema);
