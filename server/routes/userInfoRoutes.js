const router = require("express").Router();
const userInfoController = require("../controllers/userInfoController");
const verifyToken = require("../middleware/verifyToken");

router.put("/userDetails", verifyToken, userInfoController.addUserDetails);

router.get("/authUser", verifyToken, userInfoController.getAuthenticatedUser);

router.get("/:handle", userInfoController.getUserDetails);

router.get(
  "/auth/:handle",
  verifyToken,
  userInfoController.getUserDetailsAuthorized
);

router.post("/followUser", verifyToken, userInfoController.addFollowers);

router.delete(
  "/unfollowUser/:unfollow",
  verifyToken,
  userInfoController.unFollow
);

// router.delete("/delete", userInfoController.deleteAllFollowing);

router.post(
  "/bookmark/scream",
  verifyToken,
  userInfoController.bookmarkScreams
);

router.delete(
  "/bookmark/scream/:screamId",
  verifyToken,
  userInfoController.removeBookmark
);

router.get("/bookmark/scream", verifyToken, userInfoController.getBookmarks);

router.post("/access", verifyToken, userInfoController.grantFollowAccess);

router.delete(
  "/access/:notificationId",
  verifyToken,
  userInfoController.denyFollowAccess
);

module.exports = router;
