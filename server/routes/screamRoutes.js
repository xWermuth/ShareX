const router = require("express").Router();
const screamController = require("../controllers/screamController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, screamController.create);

router.post("/post", verifyToken, screamController.createtwo);

router.post(
  "/uploadFileToScream",
  verifyToken,
  screamController.uploadFileToScream
);

router.get("/allScreams", screamController.getAllScreams);

router.get("/following", verifyToken, screamController.getScreamsFromFollowers);

router.get("/:screamId", screamController.getScream);

router.delete("/:screamId", verifyToken, screamController.delete);

// router.get("/:photoId", verifyToken, photosController.show);

// router.get("/", verifyToken, photosController.index);

// router.put("/updateName", verifyToken, photosController.updateName);

// router.put("/order", verifyToken, photosController.updatePhotos);

// router.delete("/:photoId", verifyToken, photosController.destroy);

// router.put("/likes", verifyToken, photosController.updateLikes);

// router.put("/comment", verifyToken, photosController.updateComments);

module.exports = router;
