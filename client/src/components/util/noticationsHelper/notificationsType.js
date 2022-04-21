import React from "react";

export const notificationsType = (type) => {
  switch (type) {
    case "like":
      return "Liked your Scream ";

    case "comment":
      return "Commented on your Scream ";

    case "scream":
      return "Posted a new Scream ";

    case "request_follow":
      return "wants to follow you";

    default:
      return "Uknown action ";
  }
};
