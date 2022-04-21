import React, { Component } from "react";

const Mimetype = (mimetype) => {
  switch (mimetype) {
    case "image/jpeg":
      return "img";

    case "image/png":
      return "img";

    case "image/gif":
      return "img";

    case "image/jpg":
      return "img";

    case "video/mp4":
      return "video";

    default:
      return "unknownMimeType";
  }
};

export default Mimetype;
