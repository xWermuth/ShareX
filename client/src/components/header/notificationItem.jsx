import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

//MUI framework
import {
  MenuItem,
  Typography,
  Button,
  ListItemIcon,
  ListItemText,
  Avatar,
  withStyles,
  ListItemAvatar,
} from "@material-ui/core";
import clsx from "clsx";

// redux
import { connect } from "react-redux";
import {
  grantFollowAccount,
  denyFollowAccount,
  clear_notification_to_delete,
} from "../../redux/actions/userActions";

// dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// components
import { StyledMenuItem, StyledMenu } from "../util/menu/costumeMenuTabs";
import { notificationsType } from "../util/noticationsHelper/notificationsType";

const styles = (theme) => ({
  ...theme.fonts,
  postPicture: { marginLeft: 50 },
  styledMenu: {
    whiteSpace: "normal",
    "&:focus": {
      backgroundColor: "#ffffff",
    },
  },
  margin: { margin: "0px 8px" },
  sm: { fontSize: "x-small", fontWeight: "700" },
});

const NotificationItem = (props) => {
  const {
    classes,
    handleClose,
    notificationsState,
    anchorElState,
    onMenuExited,
    handleScroll,
    isFetchingState,
    hasMoreState,
  } = props;

  let notificationMarkup =
    notificationsState &&
    notificationsState.length > 0 &&
    notificationsState[0] !== "You have no notifications" ? (
      notificationsState.map((notification, index) => {
        const type = notificationsType(notification.type);
        const time = dayjs(notification.createdAt).fromNow();
        const iconColor = notification.read ? "intial" : "secondary";
        const icon = (
          <Avatar src={notification.profilePicture} alt="profilePicture" />
        );
        console.log("--here, type", notification.type);

        return (
          <StyledMenuItem className={classes.styledMenu} key={index}>
            <ListItemAvatar>{icon}</ListItemAvatar>
            <ListItemText>
              {notification.type !== "request_follow" ? (
                <Typography
                  component={Link}
                  color={notification.read ? "initial" : "secondary"}
                  variant="body2"
                  onClick={handleClose}
                  to={`/users/${
                    notification.type === "scream"
                      ? notification.sender
                      : notification.recipient
                  }/scream/${notification.screamId}`}
                >
                  <span className={classes.fontWeight700}>
                    {" "}
                    {notification.sender}
                  </span>{" "}
                  {type} {time}
                </Typography>
              ) : (
                <Typography
                  color={notification.read ? "initial" : "secondary"}
                  variant="body2"
                >
                  <span className={classes.fontWeight700}>
                    {" "}
                    {notification.sender}
                  </span>{" "}
                  {type} {time}
                </Typography>
              )}
            </ListItemText>
            <ListItemIcon>
              {notification.type === "request_follow" ? (
                <Fragment>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      props.grantFollowAccount(
                        notification.notificationId,
                        notification.sender
                      )
                    }
                    className={clsx(classes.margin, classes.sm)}
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() =>
                      props.denyFollowAccount(notification.notificationId)
                    }
                    size="small"
                    variant="outlined"
                    className={classes.sm}
                  >
                    Delete
                  </Button>
                </Fragment>
              ) : (
                <Avatar
                  src={notification.postPicture}
                  alt="postPicture"
                  variant="square"
                  className={classes.postPicture}
                />
              )}
            </ListItemIcon>
          </StyledMenuItem>
        );
      })
    ) : (
      <MenuItem onClick={handleClose}>You have no notifications yet</MenuItem>
    );

  return (
    <StyledMenu
      id="simple-menu"
      anchorEl={anchorElState}
      open={Boolean(anchorElState)}
      onClose={handleClose}
      onExited={onMenuExited}
      className={classes.menuRoot}
      onScroll={handleScroll}
    >
      {notificationMarkup}
      <span style={{ display: "flex", justifyContent: "center" }}>
        {isFetchingState && <Typography variant="body1">Loading...</Typography>}
        {!hasMoreState && notificationsState.length < 10 && (
          <Typography variant="body1">
            You have seen all notifications
          </Typography>
        )}
      </span>
    </StyledMenu>
  );
};

NotificationItem.propTypes = {
  classes: PropTypes.object,
  notificationsState: PropTypes.array,
  handleClose: PropTypes.func,
  notificationToDelete: PropTypes.string,
  anchorElState: PropTypes.bool,
  onMenuExited: PropTypes.func,
  handleScroll: PropTypes.func,
  isFetchingState: PropTypes.func,
  hasMore: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  notificationToDelete: state.user.notificationToDelete,
});

const mapActionsToProps = {
  grantFollowAccount,
  denyFollowAccount,
  clear_notification_to_delete,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(NotificationItem));
