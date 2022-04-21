const { model, Schema } = require("mongoose");

const conversationSchema = new Schema(
  {
    name: { type: String },
    type: { type: String, required: true },
    picture: { url: { type: String }, _key: { type: String } },
    time: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() },
    users: {
      user1: { type: Schema.Types.ObjectId, ref: "User", default: null },
      user2: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
  },
  { timestamps: true }
);

module.exports = model("Conversation", conversationSchema);
