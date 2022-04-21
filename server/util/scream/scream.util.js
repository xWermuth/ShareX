const User = require("../../models/user");
const asyncFunc = require("../utils");

const getAllScreams = async (screams) => {
  return Promise.all(
    screams.map(async (scream) => {
      const user = await User.findOne({ handle: scream.userHandle });
    })
  );
};
