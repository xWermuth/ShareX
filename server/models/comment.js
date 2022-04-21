const { Schema, model } = require("mongoose");

// Paginate
const paginate = require("mongoose-paginate-v2");

const commentSchema = new Schema(
  {
    userHandle: { type: String, required: true },
    screamId: { type: String, required: true },
    body: { type: String, required: true },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now() },
  },
  { collection: "comments" }
);

commentSchema.plugin(paginate);

module.exports = model("Comment", commentSchema);
