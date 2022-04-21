// @ts-nocheck
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// Components
import Profile from "../components/profile/profile";
import ProfileSkeleton from "../components/util/ProfileSkeleton";
import ProfileScreams from "../components/util/profileScreams";
import FollowRequest from "../components/profile/followRequest";

import { Grid, withStyles, Tabs, Tab } from "@material-ui/core";

// Icons
import { Bookmark, Apps } from "@material-ui/icons";

// REDUX
import { connect } from "react-redux";
import { getUserProfile, setLoading } from "../redux/actions/dataActions";
import { setHomePage } from "../redux/actions/uiActions";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    overflow: "hidden",
  },
  gridList: {
    maxWidth: 1000,
    padding: 5,
  },

  tabsRoot: {
    maxWidth: 960,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    paddingBottom: 0,
    paddingTop: 0,
    borderColor: "#707e94",
    borderTop: "1px solid",
    position: "relative",

    "& .PrivateTabIndicator-root-20": {
      top: 0,
      height: 2,
      backgroundColor: theme.palette.primary.dark,
      zIndex: 99,
    },
    "&  .Mui-selected": {
      color: theme.palette.primary.dark,
      "& .MuiTab-wrapper": { "& svg": { color: theme.palette.primary.dark } },
    },
    "& .MuiTab-root": { paddingBottom: 0 },
  },

  defaultColor: { color: "#8E8E8E", paddingBottom: 0 },
});

class User extends Component {
  state = {
    profile: null,
    screamIdParam: null,
    value: 0,
    authorizedPrivateProfile: true,
  };

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;

    const screamId = this.props.match.params.screamId;

    let isHomePage = false;
    this.props.setHomePage(isHomePage);

    this.setState({
      handleParams: handle,
      authorizedPrivateProfile: this.props.authorizedPrivateProfile,
    });
    if (screamId) {
      this.setState({ screamIdParam: screamId });
    }

    if (this.props.authUserHandle) {
      this.props.getUserProfile(handle);
    } else {
      setTimeout(() => {
        this.props.getUserProfile(handle);
      }, 1000);
    }

    this.setState({ profile: this.props.profile });
  }

  componentDidUpdate(prevProps) {
    const newHandle = this.props.match.params.handle;
    const currentHandle = prevProps.match.params.handle;
    if (currentHandle !== newHandle) {
      if (newHandle) {
        this.props.getUserProfile(newHandle);
      }
    }

    const newScreamId = this.props.match.params.screamId;
    const currentScreamId = prevProps.match.params.screamId;

    if (newScreamId !== currentScreamId) {
      this.setState({ screamIdParam: newScreamId });
    }
    const newAuthorizedPrivateProfile = this.props.authorizedPrivateProfile;
    const currentAuthorizedPrivateProfile = prevProps.authorizedPrivateProfile;

    if (currentAuthorizedPrivateProfile !== newAuthorizedPrivateProfile) {
      this.setState({ authorizedPrivateProfile: newAuthorizedPrivateProfile });
    }
  }

  render() {
    const { classes, authUserHandle } = this.props;
    const profileHandle = this.props.match.params.handle;
    const { screamIdParam, value, authorizedPrivateProfile } = this.state;
    let screams = [];

    value === 0
      ? (screams = this.props.screams)
      : (screams = this.props.bookmarks);

    const { loading, profile } = this.props.data;

    const screamsMarkup = authorizedPrivateProfile ? (
      <ProfileScreams
        screams={screams}
        value={value}
        screamIdParam={screamIdParam}
        classes={classes}
      />
    ) : (
      <Fragment />
    );

    const profileMarkup = loading ? (
      <ProfileSkeleton />
    ) : authorizedPrivateProfile ? (
      !profile ? (
        <h3>{profileHandle} cannot be found</h3>
      ) : (
        <Profile profile={profile} />
      )
    ) : (
      <FollowRequest profile={profile} />
    );

    return (
      <Grid
        container
        align="center"
        justify="center"
        style={{ paddingTop: 80 }}
      >
        <Grid item xs={12} sm={12}>
          {profileMarkup}
        </Grid>
        <Grid item xs={12} sm={12}>
          {authUserHandle === profileHandle && (
            <Tabs
              value={value}
              orientation="horizontal"
              position="top"
              variant="standard"
              centered={true}
              className={classes.tabsRoot}
              onChange={this.handleChange}
            >
              <Tab
                icon={
                  <Fragment>
                    <Apps
                      fontSize="small"
                      color="primary"
                      label="BOOKMARKED"
                      className={classes.defaultColor}
                    />
                    Screams
                  </Fragment>
                }
              />
              <Tab
                icon={
                  <Fragment>
                    <Bookmark
                      fontSize="small"
                      color="primary"
                      label="SCREAMS"
                      className={classes.defaultColor}
                    />
                    Saved
                  </Fragment>
                }
              />
            </Tabs>
          )}
          {screamsMarkup}
        </Grid>
      </Grid>
    );
  }
}

User.propTypes = {
  getUserProfile: PropTypes.func,
  setHomePage: PropTypes.func,
  setLoading: PropTypes.func,
  data: PropTypes.object,
  classes: PropTypes.object,
  bookmarks: PropTypes.array,
  screams: PropTypes.array,
  authUserHandle: PropTypes.string,
  authorizedPrivateProfile: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  data: state.data,
  screams: state.data.screams,
  bookmarks: state.user.bookmarks,
  authUserHandle: state.user.userDetail.credentials.handle,
  authorizedPrivateProfile: state.data.authorized,
});

export default connect(mapStateToProps, {
  getUserProfile,
  setHomePage,
  setLoading,
})(withStyles(styles)(User));
