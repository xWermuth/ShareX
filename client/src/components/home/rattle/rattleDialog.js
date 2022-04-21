import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// MUI
import {
  Card,
  CardContent,
  CardMedia,
  withStyles,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@material-ui/core";

// Icons
import ChatIcon from "@material-ui/icons/Chat";
import { FavoriteBorder, UnfoldMore } from "@material-ui/icons";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CloseIcon from "@material-ui/icons/Close";

// Components
import MyButton from "../../util/myButton";
import LikeButton from "../scream/likeButton";
import Commments from "../scream/comments";
import CommentForm from "./commentForm";

// Redux
import { connect } from "react-redux";
import { getScream, clearErrors } from "../../../redux/actions/dataActions";

import PropTypes from "prop-types";

const styles = (theme) => ({
  ...theme.spreadThis,
  profileImage: {
    width: 150,
    height: 150,
    maxWidth: "100%",
    borderRadius: "50%",
    objectFit: "cover",
  },
  dialogContent: {
    padding: 20,
  },
  closeButton: { position: "absolute", left: "90%" },
  expandButton: { position: "absolute", left: "90%" },
  spinnerDiv: { textAlign: "center", marginTop: 50, marginBottom: 50 },
  imgWrapper: { display: "flex", align: "center", justifyContent: "center" },
});

class RattleDialog extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: "",
  };

  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    let oldPath = window.location.pathname;
    const { userHandle, screamId } = this.props;
    const newPath = `/users/${userHandle}/scream/${screamId}`;

    if (oldPath === newPath) {
      oldPath = `/users/${userHandle}`;
    }

    window.history.pushState(null, null, newPath);

    this.setState({ open: true, oldPath, newPath });
    this.props.getScream(this.props.screamId);
  };
  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({ open: false });
    this.props.clearErrors();
  };
  render() {
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
        comments,
      },
      UI: { loading },
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} />
      </div>
    ) : (
      <Grid container>
        <Grid item sm={4} className={classes.imgWrapper}>
          <img
            src={profilePhotoUrl}
            alt="profilePhoto"
            className={classes.profileImage}
          />
        </Grid>
        <Grid item sm={8} style={{ marginBottom: 30, wordWrap: "break-word" }}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeperator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeperator} />
          <Typography variant="body1">{body}</Typography>
          <LikeButton screamId={_id} />
          <span>{likeCount} likes</span>
          <MyButton tip="Commments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
        </Grid>
        <hr className={classes.visibleSeperator} />
        <CommentForm screamId={_id} />
        <Commments comments={comments} />
      </Grid>
    );
    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip="Expand scream"
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

RattleDialog.propTypes = {
  getScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.UI,
});

const mapActionsToProps = { getScream, clearErrors };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(RattleDialog));
