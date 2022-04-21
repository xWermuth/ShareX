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
import ChatIcon from "@material-ui/icons/Chat";

// Components
import MyButton from "../../util/myButton";
import DeleteScream from "./deleteRattle";
import ScreamDialog from "./rattleDialog";
import LikeButton from "../scream/likeButton";

// Redux
import { connect } from "react-redux";

import PropTypes from "prop-types";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
    maxHeight: "10rem",
  },
  image: {
    width: "auto",
    minWidth: "10rem",
  },
  content: {
    objectFit: "cover",
    marginLeft: 10,
  },
};

class Rattle extends Component {
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
      <Card container align="start" className={classes.card}>
        <CardMedia
          image={profilePhotoUrl}
          title="Profile image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            color="primary"
            component={Link}
            to={`/users/${userHandle}`}
          >
            {userHandle}
          </Typography>

          {deleteButton}

          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>

          <LikeButton screamId={_id} />
          <span>{likeCount} likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
          <ScreamDialog
            screamId={_id}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          />
        </CardContent>
      </Card>
    );
  }
}

Rattle.propTypes = {
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Rattle));
