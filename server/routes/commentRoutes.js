const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const commentController = require("../controllers/commentController");

router.post("/", verifyToken, commentController.commentOnScream);
router.get("/:screamId", commentController.getComment);
router.delete("/:commentId", verifyToken, commentController.destroy);

module.exports = router;
