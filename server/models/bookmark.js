const { Schema, model } = require("mongoose");

const bookmarkSchema = new Schema(
  {
    userHandle: { type: String, required: true },
    url: { type: String, required: true },
    screamId: { type: String, required: true },
    screamHandle: { type: String, required: true },
  },
  { timestamps: true, collection: "bookmarks" }
);

module.exports = model("Bookmark", bookmarkSchema);
