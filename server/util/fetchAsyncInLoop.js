const Scream = require("../models/scream");

async function getMappedItem(item, index) {
  console.log("-----", item.following);
  const screams = await Scream.find({ userHandle: item.following }).sort({
    createdAt: "descending",
  });

  if (!screams) {
    throw new Error("Screams does not exist");
  }

  return screams;
}

module.exports = { getMappedItem };
