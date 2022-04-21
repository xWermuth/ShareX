import React from "react";
import PropTypes from "prop-types";
import { Button, Badge, Avatar, Tooltip } from "@material-ui/core";
import {
  Theme,
  makeStyles,
  withStyles,
  createStyles,
} from "@material-ui/core/styles";

const StyledBadge = withStyles((theme) =>
  createStyles({
    badge: {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "$ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  })
)(Badge);

const AvatarButton = ({
  profileImage,
  userHandle,
  conversation_id,
  receiverId,
  onClick,
  unReadMessages,
}) => {
  const handleClick = () => onClick(conversation_id, receiverId);

  const badgeMarkup =
    unReadMessages === 0 ? (
      <StyledBadge
        overlap="circle"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
      >
        <Avatar alt="profile picture" src={profileImage} />
      </StyledBadge>
    ) : (
      <Badge
        badgeContent={unReadMessages}
        color="primary"
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <StyledBadge
          overlap="circle"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar alt="profile picture" src={profileImage} />
        </StyledBadge>
      </Badge>
    );

  return (
    <Tooltip title={userHandle} placement="left">
      <Button onClick={handleClick}>{badgeMarkup}</Button>
    </Tooltip>
  );
};

AvatarButton.propTypes = {
  profileImage: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  conversation_id: PropTypes.string,
  receiverId: PropTypes.string.isRequired,
};

export default AvatarButton;
