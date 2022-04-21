//MODEL
const Scream = require("../models/scream");

//SERVER
const server = require("../services/fileUpload");
const singleUpload = server.upload.single("image");

singleUpload(req, res, async function (err) {
  if (err) {
    return res.status(422).send({
      errors: [{ title: "File Upload Error", detail: err.message }],
    });
  } else if (!validator.validateMimeType(req.file.mimetype)) {
    return res
      .status(400)
      .send({ error: "Wrong file type, " + req.file.mimetype + "" });
  }

  await User.findById(userId, async function (err, user) {
    if (err) {
      res.status(400).send({ error: err });
    }

    console.log(user);
    user.userDetail.credentials.profilePicture.url = req.file.location;
    user.userDetail.credentials.profilePicture._key = req.file.key;
    user.save();

    const profilePictureAfter = req.file.location;

    if (profilePictureBefore !== profilePictureAfter) {
      await Comment.updateMany(
        { userHandle },
        { imageUrl: profilePictureAfter },
        { new: true }
      );

      console.log("Profile picture successfully updated for comments");

      await Scream.updateMany(
        { userHandle },
        { profilePhotoUrl: profilePictureAfter },
        { new: true }
      );

      console.log("Profile picture successfully updated for screams");
    }
  });

  res.status(200).send({ message: "Image uploaded succesfully" });
});
