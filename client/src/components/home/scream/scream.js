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
  Avatar,
  CardHeader,
  IconButton,
  CardActions,
} from "@material-ui/core";

// Icons
import ChatIcon from "@material-ui/icons/Chat";

// Components
import MyButton from "../../util/myButton";
import DeleteScream from "./deleteScream";
import ScreamDialog from "./screamDialog";
import LikeButton from "./likeButton";
import CustomMenu from "./menu";
import BookmarkButton from "./bookmarkButton";

// Redux
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { MoreVert } from "@material-ui/icons";

const styles = {
  root: {
    maxWidth: 500,
    marginBottom: 30,
  },
  screamHeader: { padding: 8 },
  media: {
    height: "auto",
    paddingTop: "99.25%", // 16:9,
    marginTop: "30",
  },
  bodyWrapper: { paddingBottom: 0 },
  handle: {
    fontWeight: 700,
    color: "#262626",
  },
  body: {
    wordWrap: "break-word",
  },
  bookmark: {
    marginLeft: "auto !important",
  },
};

class Scream extends Component {
  onClick = () => {
    this.child.handleOpen();
  };
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      scream: {
        userHandle,
        createdAt,
        body,
        _id,
        likeCount,
        commentCount,
        profilePhotoUrl,
        postContent: { url },
      },
      user: {
        authenticated,
        userDetail: {
          credentials: { handle },
        },
      },
    } = this.props;

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteScream screamId={_id} />
      ) : null;

    return (
      <Card container="true" align="start" className={classes.root}>
        <CardHeader
          className={classes.screamHeader}
          avatar={
            <Avatar
              alt="profilePicture"
              src={profilePhotoUrl}
              className={classes.profilePicture}
            />
          }
          title={
            <div className={classes.usernameWrapper}>
              <Typography
                variant="h5"
                color="primary"
                component={Link}
                to={`/users/${userHandle}`}
              >
                {userHandle}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {dayjs(createdAt).fromNow()}
              </Typography>
            </div>
          }
          action={<CustomMenu screamId={_id} userHandle={userHandle} />}
        />
        <CardMedia
          className={classes.media}
          image={url}
          title={`${userHandle}'s Scream`}
        />
        <CardContent className={classes.bodyWrapper}>
          <Typography variant="body1" component="p" className={classes.body}>
            <span className={classes.handle}>{userHandle}</span> {body}
          </Typography>
        </CardContent>
        <CardActions>
          <LikeButton screamId={_id} />
          <span style={{ margin: 0 }}>
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </span>
          <MyButton
            tip="Add comment"
            tip="Comment on scream"
            onClick={this.onClick}
          >
            <ChatIcon color="primary" />
          </MyButton>
          <ScreamDialog
            onRef={(ref) => (this.child = ref)}
            screamId={_id}
            openDialog={this.props.openDialog}
            userHandle={userHandle}
          />
          <span style={{ margin: 0 }}>{commentCount} comments</span>

          <BookmarkButton
            isMenu={false}
            screamId={_id}
            className={classes.bookmark}
          />
        </CardActions>
      </Card>
    );
  }
}

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));
