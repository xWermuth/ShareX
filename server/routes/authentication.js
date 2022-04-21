const router = require("express").Router();
const authenticationController = require("../controllers/authenticationController");
const verifyToken = require("../middleware/verifyToken");

router.post("/signup", authenticationController.create);
router.post("/login", authenticationController.login);
router.delete("/delete", verifyToken, authenticationController.destroy);

module.exports = router;
