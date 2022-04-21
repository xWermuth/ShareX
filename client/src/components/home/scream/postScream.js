import React, { Component } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import {
  Card,
  CardContent,
  CardMedia,
  withStyles,
  Typography,
} from "@material-ui/core";

// Icons

// Components
import PostScreamDialog from "./postScreamDialog";
import LoadingProfileImageSkeleton from "../../util/ProfileImageSkeleton";

// Redux
import { connect } from "react-redux";

import PropTypes from "prop-types";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    marginBottom: 30,
    height: "6rem",
    maxWidth: 500,

    alignItems: "center",
  },
  imgContainer: {
    marginLeft: 15,
    padding: 10,
  },
  image: {
    width: "auto",
    height: "auto",
    width: "45px",
    height: "45px",
    borderRadius: "50%",
  },
  input: {
    width: "90%",
    height: 40,
    backgroundColor: "#E2E8F0",
    color: "#989CA1",
    borderRadius: "20px",
    padding: "0px 12px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  paragraph: { width: "100%" },
  content: {
    width: "100%",
    objectFit: "cover",
    padding: "0px !important",
  },
};

class PostScream extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      user: {
        authenticated,
        userDetail: {
          credentials: {
            handle,
            profilePicture: { url },
          },
        },
      },
    } = this.props;

    const userImgComponent = url ? (
      <CardMedia image={url} title="Profile image" className={classes.image} />
    ) : (
      <LoadingProfileImageSkeleton className={classes.image} />
    );

    return (
      <Card container="true" align="start" className={classes.card}>
        <CardContent className={classes.imgContainer}>
          {userImgComponent}
        </CardContent>

        <CardContent className={classes.content}>
          <div className={classes.input}>
            <PostScreamDialog type="text" className={classes.paragraph} />
          </div>
        </CardContent>
      </Card>
    );
  }
}

PostScream.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(PostScream));
