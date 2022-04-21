// @ts-nocheck
import React, { Fragment } from "react";
import { Avatar, Typography, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useHover } from "../../hooks/useHover";
import { connect } from "react-redux";

const style = (theme) => ({
  bubbleBox: {
    paddingTop: "1.6rem",
    paddingBottom: "1rem",
    paddingLeft: "3.5rem",
    display: "flex",
    flexDirection: "column",
  },
  chatBubbleContainer: {
    flex: "0 0 auto",
    display: "flex",
    padding: "0 16px 4px 16px",
    position: "relative",
    alignItems: "flex-start",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  avatar: { position: "absolute", left: -42, margin: 0 },
  chat: {
    color: "#ffffff",
    backgroundColor: "#555555",
    whiteSpace: "pre-wrap",
    maxWidth: "100%",
    position: "relative",
    padding: 8,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  },
  senderCorner: { borderBottomLeftRadius: 20, borderBottomRightRadius: 5 },
  receiverCorner: { borderBottomRightRadius: 20, borderBottomLeftRadius: 5 },
  dateDisplay: {
    display: "flex",
    fontSize: 11,
    position: "absolute",
    top: "100%",
    whiteSpace: "nowrap",
    fontWeight: 400,
    fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
  },
});

const ChatBubble = ({
  classes,
  senderId,
  type,
  profileImage,
  message,
  timeObj: { time, addTime },
  userId,
  groupBubbles,
}) => {
  const [hoverRef, isHovered] = useHover();

  const sender = userId === senderId;

  return (
    <div
      className={classes.bubbleBox}
      style={{ marginTop: groupBubbles ? -35 : "" }}
    >
      <div
        className={classes.chatBubbleContainer}
        style={{ alignItems: sender ? "flex-end" : "flex-start" }}
      >
        {!sender && (
          <Avatar
            alt="profile img"
            src={profileImage}
            className={classes.avatar}
          />
        )}

        <div
          className={clsx(
            classes.chat,
            sender ? classes.senderCorner : classes.receiverCorner
          )}
          style={{ backgroundColor: sender ? "#0095F6" : "#555555" }}
          ref={hoverRef}
        >
          {message}
        </div>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.dateDisplay}
          style={{ left: !sender ? 20 : "", right: sender ? 20 : "" }}
        >
          {addTime ? time : <Fragment>{isHovered && time}</Fragment>}
        </Typography>
      </div>
    </div>
  );
};

ChatBubble.prototype = {
  classes: PropTypes.object.isRequired,
  sender: PropTypes.bool.isRequired,
  timeObj: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  profileImage: PropTypes.string,
  type: PropTypes.string.isRequired,
  groupBubbles: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  userId: state.user._id,
});

const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(style)(ChatBubble));
