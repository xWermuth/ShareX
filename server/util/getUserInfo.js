const User = require("../models/user");
const Scream = require("../models/scream");
const Access = require("../models/access");

const getUserInfo = async (res, userHandle, requester, isSameUser) => {
  const user = await User.findOne({ handle: userHandle });
  let response = {};

  if (!user) {
    return res.status(404).send({ error: "User does not exist" });
  }

  const access = await Access.findOne({ requester, receiver: userHandle });
  response.userDetails = user.userDetail;

  if (user.userDetail.credentials.privacy && !isSameUser) {
    if (!access) {
      return res.status(401).send(response);
    }

    response.isRequesting = true;
    if (!access.grantedAccess) {
      return res.status(401).send(response);
    }
  }

  const screams = await Scream.find({ userHandle }).sort({
    createdAt: "descending",
  });

  response.screams = screams;
  response.userDetails = user.userDetail;
  response.id = user._id;

  res.status(200).send(response);
};

module.exports = { getUserInfo };
