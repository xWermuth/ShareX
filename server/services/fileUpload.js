const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-with-transforms");
const idGenerator = require("mongoose").Types.ObjectId;
const sharp = require("sharp");
const MyError = require("../middleware/error");

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY_ID,
  accessKeyId: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-west-1",
});

const s3 = new aws.S3();

let fileSize = 1024 * 1024 * 15;

const fileValidator = (file) => {
  switch (file.mimetype) {
    case "image/jpeg":
      return ".jpeg";

    case "image/png":
      return ".png";

    case "image/gif":
      return ".gif";

    case "image/jpg":
      return ".jpg";

    case "image/HEIC":
      return ".HEIC";

    case "video/mp4":
      fileSize = 1024 * 1024 * 200;
      return ".mp4";

    default:
      throw new Error("Unknown file type " + file.mimetype + "");
  }
};

/*UPLOAD TO AWS SERVER*/

function s3Configs(isProfilePic) {
  const imgSize = isProfilePic ? 300 : 1500;
  const multerS3Config = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    transforms: () => sharp().resize(imgSize, imgSize).withMetadata(),

    metadata: function (req, file, cb) {
      cb(null, { fieldName: "SHAREX_PHOTOS" });
    },
    key: function (req, file, cb) {
      const fileType = fileValidator(file);

      cb(null, new Date().toISOString() + "-" + idGenerator() + fileType);
    },
  });

  return multerS3Config;
}

const uploadScream = multer({
  storage: s3Configs(false),
  limits: { fileSize },
});

const uploadProfilePic = multer({
  storage: s3Configs(true),
  limits: { fileSize },
});

/*DELETE FROM AWS SERVER*/
const deleteObj = (key) => {
  s3.deleteObject(
    {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    },
    function (err, data) {
      if (err) {
        console.log(err);
        return err;
      }
      console.log("data", data);
    }
  );
};

module.exports = { uploadScream, uploadProfilePic, deleteObj };
