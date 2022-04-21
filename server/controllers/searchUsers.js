// model
const User = require("../models/user");

module.exports = {
  async searchUsers(req, res) {
    const { searchQuery } = req.body;

    try {
      if (searchQuery.trim().length < 1) {
        return res.status(400).send({ user: "No users found" });
      }

      const users = await User.aggregate([
        {
          $search: {
            autocomplete: {
              query: searchQuery,
              path: "handle",
              fuzzy: { maxEdits: 1, prefixLength: 0 },
            },
          },
        },
        {
          $project: {
            profilePicture: "$userDetail.credentials.profilePicture.url",
            handle: "$handle",
          },
        },
      ]);

      console.log("---", searchQuery);
      res.status(200).send(users);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  },
};
