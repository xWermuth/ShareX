const router = require("express").Router();
const searchUsers = require("../controllers/searchUsers");
const verifyToken = require("../middleware/verifyToken");

router.post("/", searchUsers.searchUsers);

module.exports = router;
