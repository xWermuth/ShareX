const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const notificationsController = require("../controllers/notificationsController");

router.post("/readNotification", verifyToken, notificationsController.markRead);
router.post(
  "/readAllNotification",
  verifyToken,
  notificationsController.markAllAsRead
);

router.get(
  "/getNotification",
  verifyToken,
  notificationsController.getNotifications
);

module.exports = router;
