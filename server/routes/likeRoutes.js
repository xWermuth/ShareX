const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const likeController = require("../controllers/likeController");

router.post("/scream/:screamId", verifyToken, likeController.likeUnLikeScream);

module.exports = router;
