const router = require("express").Router();
const photosController = require("../controllers/photosController");
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/scream/:screamId",
  verifyToken,
  photosController.uploadPictureToScream
);

router.post(
  "/profilePicture",
  verifyToken,
  photosController.uploadProfilePicture
);

router.delete(
  "/profilePicture",
  verifyToken,
  photosController.deleteProfilePicture
);

router.get("/:photoId", verifyToken, photosController.show);

// router.get("/", verifyToken, photosController.index);

router.delete("/:photoId", verifyToken, photosController.destroy);

module.exports = router;
