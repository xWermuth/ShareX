import React, { useCallback, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";

// MUI
import {
  Button,
  withStyles,
  CircularProgress,
  Typography,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

// Icons
import {
  PersonAdd as PersonAddIcon,
  PersonAddDisabled,
} from "@material-ui/icons";

// redux
import { connect } from "react-redux";
import { followUser, unfollowUser } from "../../../redux/actions/userActions";
import { useConfirmationDialog } from "../../../hooks/useConfirmationDialog";

// components
import ConfirmationDialog from "../../util/following/confirmationDialog";
import { StyledMenuItem } from "../../util/menu/costumeMenuTabs";

import PropTypes from "prop-types";

const styles = (theme) => ({
  ...theme.fonts,
  followBtn: {
    fontWeight: 700,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: "x-small",
  },
  spinner: { position: "absolute" },
  fontWeight700: { fontWeight: 700, cursor: "pointer" },
});

const FollowButton = (props) => {
  const {
    classes,
    user: { authenticated },
    loading,
    type,
    isRequestingFollow,
    handle,
  } = props;

  const isFollowing = useCallback(() => {
    const following = props.user.following;
    if (
      following &&
      following.find((user) => user.userHandle === props.handle)
    ) {
      return true;
    } else {
      return false;
    }
  }, [props.handle, props.user.following]);

  const followUser = useCallback(() => {
    if (loading) return;
    props.followUser(props.handle);
  }, [props.handle]);

  const unfollowUser = useCallback(() => {
    if (loading) return;
    props.unfollowUser(props.handle);
  }, [props.handle]);

  const {
    isConfirmationOpen,
    handleOnExit,
    handleOnClose,
    handleOnOpen,
    handleOnConfirm,
  } = useConfirmationDialog((handle) => props.unfollowUser(handle));
  useEffect(() => {
    handleOnClose();
  }, [handleOnClose]);

  const spinner = loading ? (
    <CircularProgress
      size={30}
      className={classes.spinner}
      style={{ right: type === "text" ? "35%" : "35%" }}
    />
  ) : null;

  if (type === "button") {
    const followButton = !authenticated ? (
      <Link to="/login">
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.followBtn}
        >
          Follow
        </Button>
      </Link>
    ) : isFollowing() || isRequestingFollow ? (
      <Fragment>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => handleOnOpen(handle)}
          className={classes.followBtn}
          disabled={loading}
        >
          {isRequestingFollow ? "Requested" : "Following"}
          {spinner}
        </Button>
        <ConfirmationDialog
          isOpen={isConfirmationOpen}
          onClose={handleOnConfirm}
          onExited={handleOnExit}
          message={`Are you sure you want to unfollow ${handle}?`}
        />
      </Fragment>
    ) : (
      <Button
        variant="contained"
        color="primary"
        className={classes.followBtn}
        onClick={followUser}
        disabled={loading}
      >
        Follow
        {spinner}
      </Button>
    );

    return followButton;
  } else if (type === "text") {
    const textMarkup = authenticated ? (
      isFollowing() ? (
        <Fragment>
          <Typography
            className={classes.fontWeight700}
            variant="body2"
            color="primary"
            gutterBottom
            onClick={unfollowUser}
            disabled={loading}
          >
            {isRequestingFollow ? "Requested" : "Following"}
          </Typography>
          {spinner}
        </Fragment>
      ) : (
        <Fragment>
          <Typography
            className={classes.fontWeight700}
            variant="body2"
            color="primary"
            gutterBottom
            onClick={followUser}
            disabled={loading}
          >
            Follow
          </Typography>
          {spinner}
        </Fragment>
      )
    ) : (
      <Typography
        className={classes.fontWeight700}
        variant="body2"
        color="primary"
        gutterBottom
        component={Link}
        to={"/login"}
      >
        Follow
      </Typography>
    );

    return textMarkup;
  } else if (type === "menu") {
    const followbtnmarkup = authenticated ? (
      isFollowing() ? (
        <StyledMenuItem onClick={unfollowUser} disabled={loading}>
          <ListItemIcon>
            <PersonAddDisabled fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Following" />
        </StyledMenuItem>
      ) : (
        <StyledMenuItem onClick={followUser} disabled={loading}>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Follow user" />
        </StyledMenuItem>
      )
    ) : (
      <Link to="/login">
        <StyledMenuItem>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Follow user" />
        </StyledMenuItem>
      </Link>
    );
    return <Fragment>{followbtnmarkup}</Fragment>;
  } else {
    return <Typography variant="body1">You need to specify a type</Typography>;
  }
};

FollowButton.propTypes = {
  user: PropTypes.object,
  handle: PropTypes.string,
  followUser: PropTypes.func,
  unfollowUser: PropTypes.func,
  following: PropTypes.arr,
  classes: PropTypes.object,
  loading: PropTypes.bool,
  type: PropTypes.string,
  isRequestingFollow: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  user: state.user,
  loading: state.data.loading_button,
  isRequestingFollow: state.data.isRequestingFollow,
  following: state.user.following,
});

const mapActionsToProps = {
  followUser,
  unfollowUser,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(FollowButton));
