const { Schema, model } = require("mongoose");

// Paginate
const paginate = require("mongoose-paginate-v2");

const screamSchema = new Schema(
  {
    userHandle: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
    },
    body: {
      type: String,
      required: true,
    },
    profilePhotoUrl: {
      type: String,
      required: true,
    },
    postContent: {
      url: {
        type: String,
        required: true,
      },
      _key: {
        type: String,
        required: true,
      },
      type: { type: String, required: true },
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    userPhoto: {
      url: { type: String },
      serverKey: { type: String },
    },
  },
  { collection: "screams", timestamps: true }
);

screamSchema.plugin(paginate);

module.exports = model("Scream", screamSchema);
