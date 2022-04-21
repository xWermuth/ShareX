const router = require("express").Router();
const chatController = require("../controllers/chatController");
const verifyToken = require("../middleware/verifyToken");

router.get("/private/:convId", verifyToken, chatController.getPrivateChats);
router.post("/read", verifyToken, chatController.readChats);
router.get("/deleteAllConv", verifyToken, chatController.deleteAllConv);

module.exports = router;
