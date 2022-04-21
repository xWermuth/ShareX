const router = require("express").Router();
const userInfoController = require("../controllers/userInfoController");
const verifyToken = require("../middleware/verifyToken");

router.get("/:handle", verifyToken, userInfoController.getUserDetails);
router.get("/authUser", verifyToken, userInfoController.getAuthenticatedUser);

module.exports = router;
