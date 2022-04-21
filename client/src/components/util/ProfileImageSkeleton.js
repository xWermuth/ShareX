import React from "react";

// MUI
import { CardMedia } from "@material-ui/core";

const defaultImage =
  "https://sharex-1.s3-eu-west-1.amazonaws.com/defaultProfilePic.png";

const ProfileImageSkeleton = (props) => {
  const { className } = props;
  return (
    <CardMedia
      image={defaultImage}
      title="Profile image"
      className={className}
    ></CardMedia>
  );
};

export default ProfileImageSkeleton;
