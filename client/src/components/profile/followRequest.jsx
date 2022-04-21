// @ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import dayjs from "dayjs";

import {
  Grid,
  Avatar,
  withStyles,
  Link,
  Typography,
  Paper,
  CardContent,
} from "@material-ui/core";
import MuiLink from "@material-ui/core/Link/Link";
import { MAX_WIDTH_FOR_SYSTEM } from "../util/config";
import FollowBtn from "../home/scream/followButton";

import {
  LocationOn,
  Link as LinkIcon,
  CalendarToday,
} from "@material-ui/icons";

import { connect } from "react-redux";

const styles = (theme) => ({
  ...theme.spreadProfile,
  profileIMG: {
    width: theme.spacing(18),
    height: theme.spacing(18),
  },
  maxWidth: {
    maxWidth: MAX_WIDTH_FOR_SYSTEM,
  },
  fontWeight700: { fontWeight: 700 },
  followerInfo: {
    fontSize: "1rem",
    paddingRight: 30,
    [theme.breakpoints.down("sm")]: { fontSize: "0.8rem", paddingRight: 0 },
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
  },
  infoBox: {
    maxWidth: "100%",
    padding: 15,
    [theme.breakpoints.down("md")]: { maxWidth: "60%", padding: 20 },
    [theme.breakpoints.down("sm")]: { maxWidth: "80%" },
  },
  infoBoxContent: {
    width: "40%",
    maxWidth: "40%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      maxWidth: "100%",
    },
  },
  pr10: {
    paddingRight: 20,
  },
  pl: {
    paddingLeft: 0,
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

export const FollowRequest = (props) => {
  const { classes, selfHandle } = props;
  const {
    profile: {
      handle,
      createdAt,
      profilePicture: { url },
      userInfo: { bio, website, location },
      followersCount,
      followingCount,
      posts,
    },
  } = props;

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      align="center"
      className={classes.maxWidth}
    >
      <Grid item lg={4} md={4} sm={12} xs={12}>
        <span className={classes.profileImageBorder}>
          <Avatar
            src={url}
            className={clsx(classes.profileImage, classes.profileIMG)}
            htmlFor="profileImage"
          />
        </span>
      </Grid>
      <Grid item lg={8} md={8} sm={12} xs={12} align="start">
        <Grid container direction="row" spacing={3} justify="flex-start">
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <div className={classes.profileHeader}>
              <MuiLink
                component={Link}
                to={`/users/${handle}`}
                color="primary"
                variant="h5"
                className={classes.pr10}
              >
                {handle}
              </MuiLink>
              <FollowBtn handle={handle} type="button" />
            </div>
          </Grid>

          <Grid item md={4} sm={4}>
            <Typography variant="body1" className={classes.followerInfo}>
              <span className={classes.fontWeight700}>{posts}</span> Screams
            </Typography>
          </Grid>

          <Grid item md={4} sm={4}>
            <Typography variant="body1" className={classes.followerInfo}>
              <span className={classes.fontWeight700}>{followersCount}</span>{" "}
              Followers
            </Typography>
          </Grid>

          <Grid item md={4} sm={4}>
            <Typography variant="body1" className={classes.followerInfo}>
              <span className={classes.fontWeight700}>{followingCount}</span>{" "}
              Following
            </Typography>
          </Grid>

          <Grid item md>
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
                  <LocationOn
                    color="primary"
                    className={classes.marginRight5}
                  />{" "}
                  <span>{location}</span>
                </div>
              )}
              {website && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingBottom: 5,
                    width: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
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
                <CalendarToday
                  color="primary"
                  className={classes.marginRight5}
                />
                <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Paper elevation={1} className={classes.infoBox}>
          <CardContent className={classes.infoBoxContent}>
            <Typography variant="subtitle1">
              <b>This user is private</b>
            </Typography>
          </CardContent>
          <CardContent
            className={classes.infoBoxContent}
            style={{ paddingTop: 0 }}
          >
            <Typography variant="subtitle1">
              Follow {handle} to view {handle}'s media!
            </Typography>
          </CardContent>
        </Paper>
        <Grid item></Grid>
      </Grid>
    </Grid>
  );
};

FollowRequest.propTypes = {
  profile: PropTypes.object,
  imgurl: PropTypes.string,
  selfHandle: PropTypes.string,
};

const mapStateToProps = (state) => ({
  selfHandle: state.user.userDetail.credentials.handle,
});

const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(FollowRequest));
