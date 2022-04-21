import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// Components
import {
  logoutUser,
  uploadProfileImage,
} from "../../redux/actions/userActions";

import EditDetials from "./editDetails";
import FollowBtn from "../home/scream/followButton";
import MyButton from "../util/myButton";
import ProfileSkeleton from "../util/ProfileSkeleton";

// redux
import { connect } from "react-redux";

// MATERIAL UI
import {
  withStyles,
  Typography,
  Grid,
  Avatar,
  CardHeader,
  CircularProgress,
} from "@material-ui/core";
import MuiLink from "@material-ui/core/Link/Link";

//icons
import { LocationOn, CalendarToday } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import LinkIcon from "@material-ui/icons/Link";

import dayjs from "dayjs";

const style = (theme) => ({
  ...theme.fonts,
  ...theme.margins,
  profileContainer: {
    maxWidth: 1000,
  },
  profileImageWrapper: { padding: 20, paddingTop: 30 },
  profileImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 5,
  },
  profileImage: {
    position: "relative",
    width: theme.spacing(18),
    height: theme.spacing(18),
    borderColor: theme.palette.secondary.main,
    border: "1px solid",
    cursor: "pointer",
  },
  profileImageBorder: {
    padding: 5,
    borderColor: theme.palette.secondary.main,
    borderRadius: "50%",
    border: "4px solid",
  },
  userInfo: {
    padding: 20,
  },
  cardHeader: { paddingLeft: 0, paddingBottom: 0 },
  button: {
    fontWeight: 700,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: "x-small",
  },
  userBio: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  editButton: {
    transition: "0.3s",
    zIndex: 99,
    position: "absolute",
  },
  spinner: { position: "absolute", zIndex: 99 },
  followerInfo: {
    fontSize: "1rem",
    [theme.breakpoints.down("sm")]: { fontSize: "0.8rem" },
  },
  handleTextOverflow: {
    maxWidth: "100%",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("sm")]: {
      maxWidth: 300,
    },
  },
});

class Profile extends Component {
  state = {
    open: false,
    isLoading: true,
  };

  handleImageChange = (event) => {
    const image = event.target.files[0];

    //Send image to server
    const formData = new FormData();
    formData.append("image", image, image.name);

    this.props.uploadProfileImage(formData);
  };

  handleEditPicture = () => {
    if (
      this.props.profile.handle !==
      this.props.user.userDetail.credentials.handle
    ) {
      return;
    }
    const fileinput = document.getElementById("profileImage");
    fileinput.click();
  };

  handleLogout = () => {
    this.props.logoutUser();
  };
  handleMouseEnter = () => {
    this.setState({ open: true });
  };
  handleMouseLeave = () => {
    this.setState({ open: false });
  };
  render() {
    if (
      this.props.profile.handle !==
      this.props.user.userDetail.credentials.handle
    ) {
      var {
        classes,
        profile: {
          handle,
          createdAt,
          profilePicture: { url },
          userInfo: { bio, website, location },
          followersCount,
          followingCount,
          posts,
        },

        user: { loading, authenticated },
      } = this.props;
    } else {
      var {
        classes,
        user: {
          loading,
          authenticated,
          userDetail: {
            credentials: {
              handle,
              createdAt,
              profilePicture: { url },
              userInfo: { bio, website, location },
              followersCount,
              followingCount,
              posts,
            },
          },
        },
        loadingUI,
      } = this.props;
    }

    let userHandle = this.props.user.userDetail.credentials.handle;

    const { open } = this.state;

    let editPictureBtn =
      authenticated && userHandle === handle ? (
        <MyButton
          tip="Edit profile picure"
          onClick={this.handleEditPicture}
          btnClassName={classes.editButton}
        >
          <EditIcon color="secondary" />
        </MyButton>
      ) : null;

    let profileMarkup = !loading ? (
      <Grid container justify="flex-start" className={classes.profileContainer}>
        <Grid item xs={12} sm={4} className={classes.profileImageWrapper}>
          <div
            className={classes.profileImageContainer}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            <span
              className={classes.profileImageBorder}
              style={{
                opacity: loadingUI ? 0.2 : 1,
              }}
            >
              <Avatar
                src={url}
                className={classes.profileImage}
                onClick={this.handleEditPicture}
                htmlFor="profileImage"
              />
            </span>
            {loadingUI && (
              <CircularProgress
                size={165}
                className={classes.spinner}
                color="secondary"
              />
            )}
            <input
              type="file"
              id="profileImage"
              onChange={this.handleImageChange}
              hidden="hidden"
            />
            {open && editPictureBtn}
          </div>
        </Grid>
        <Grid
          container
          align="center"
          direction="row"
          sm={8}
          xs={12}
          className={classes.userInfo}
        >
          <CardHeader
            className={classes.cardHeader}
            title={userTitle(authenticated, handle, userHandle)}
          />

          <Grid
            container
            direction="row"
            spacing={6}
            className={classes.userStats}
          >
            <Grid item style={{ paddingLeft: 0 }}>
              <Typography variant="body1" className={classes.followerInfo}>
                <span className={classes.fontWeight700}>{posts} </span> Screams
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" className={classes.followerInfo}>
                <span className={classes.fontWeight700}>{followersCount} </span>{" "}
                Followers
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" className={classes.followerInfo}>
                {" "}
                <span className={classes.fontWeight700}>
                  {followingCount}{" "}
                </span>{" "}
                Following
              </Typography>
            </Grid>
          </Grid>

          <div className={classes.userBio}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingBottom: 5,
              }}
            >
              <MuiLink
                component={Link}
                to={`/users/${handle}`}
                color="inherit"
                variant="body1"
                className={classes.fontWeight700}
              >
                {handle}
              </MuiLink>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingBottom: 5,
              }}
            >
              {bio && (
                <Typography variant="body1" style={{ textAlign: "initial" }}>
                  {bio}
                </Typography>
              )}
            </div>

            {location && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  paddingBottom: 5,
                }}
              >
                <LocationOn color="primary" className={classes.marginRight5} />{" "}
                <span>{location}</span>
              </div>
            )}
            {website && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  paddingBottom: 5,
                }}
              >
                <LinkIcon color="primary" className={classes.marginRight5} />
                <span className={classes.handleTextOverflow}>
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#00376B",
                      fontWeight: 500,
                    }}
                  >
                    {website}
                  </a>
                </span>
                <hr />
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingBottom: 5,
              }}
            >
              <CalendarToday color="primary" className={classes.marginRight5} />{" "}
              <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
            </div>
          </div>
        </Grid>
      </Grid>
    ) : (
      <ProfileSkeleton />
    );

    return profileMarkup;
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  loading: state.data.loading,
  loadingUI: state.UI.loading,
});

const mapActionsToProps = { logoutUser, uploadProfileImage };

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  uploadProfileImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingUI: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(style)(Profile));

const userTitle = (authenticated, handleParams, handle) => {
  let button =
    authenticated && handleParams === handle ? (
      <EditDetials />
    ) : (
      <FollowBtn handle={handleParams} type="button" />
    );

  return (
    <Grid container direction="row" align="center" spacing={2}>
      <Grid item style={{ paddingLeft: 0 }}>
        <Typography variant="h5" color="primary">
          {handleParams}
        </Typography>
      </Grid>

      <Grid item>{button}</Grid>
    </Grid>
  );
};
