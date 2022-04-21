const { Schema, model } = require("mongoose");

const paginate = require("mongoose-paginate-v2");

const followSchema = new Schema(
  {
    following: { type: String, required: true },
    following_id: { type: Schema.Types.ObjectId },
    follower: { type: String, required: true },
    createdAt: { type: Date, default: Date.now(), required: true },
  },
  { collection: "followers" }
);

followSchema.plugin(paginate);

module.exports = model("Follow", followSchema);
