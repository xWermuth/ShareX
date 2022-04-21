const { Schema, model } = require("mongoose");

const likesSchema = new Schema(
  {
    userHandle: { type: String, required: true },
    screamId: { type: String, required: true },
  },
  { timestamps: true, collection: "likes" }
);

module.exports = model("Like", likesSchema);
