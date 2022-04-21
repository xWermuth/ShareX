const { Schema, model } = require("mongoose");

// Paginate
const paginate = require("mongoose-paginate-v2");

const notificationScema = new Schema(
  {
    recipient: { type: String, required: true },
    sender: { type: String, required: true },
    read: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now(), required: true },
    screamId: { type: String },
    type: { type: String, required: true },
    id: { type: String },
    profilePicture: { type: String },
    postPicture: { type: String },
  },
  { timestamps: true, collection: "notifications" }
);

notificationScema.plugin(paginate);

module.exports = model("Notification", notificationScema);
