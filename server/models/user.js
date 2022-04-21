const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      max: 12,
      min: 2,
      unique: true,
    },
    handle: {
      type: String,
      required: true,
      max: 12,
      min: 2,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      max: 12,
      min: 4,
      select: false,
    },
    userDetail: {
      credentials: {
        privacy: {
          type: Boolean,
          default: false,
        },
        email: {
          type: String,
          default: "",
          max: 12,
          min: 2,
          unique: true,
        },
        handle: {
          type: String,
          default: "",
          max: 12,
          min: 2,
          unique: true,
        },
        profilePicture: {
          url: {
            type: String,
            default: process.env.DEFAULT_PROFILE_PICTURE,
          },
          _key: {
            type: String,
            default: "KEY",
          },
        },
        userInfo: {
          bio: {
            type: String,
            default: "This user has no bio",
          },
          website: {
            type: String,
          },
          location: {
            type: String,
          },
          totalLikes: {
            type: Number,
            default: 0,
          },
        },
        followersCount: { type: Number, default: 0 },
        followingCount: { type: Number, default: 0 },
        posts: { type: Number, default: 0 },
        likes: [{ userHandle: { type: String }, screamId: { type: String } }],
      },
    },
  },
  {
    timestamps: true,
  },
  { collection: "users" }
);

module.exports = model("User", userSchema);
