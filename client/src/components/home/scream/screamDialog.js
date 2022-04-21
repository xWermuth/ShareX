// MUI
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  withStyles,
} from "@material-ui/core";
// Icons
import { Chat as ChatIcon, Telegram as SendIcon } from "@material-ui/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  clearErrors,
  getComments,
  getScream,
} from "../../../redux/actions/dataActions";
// Components
import MyButton from "../../util/myButton";
import AvatarMarkup from "../../util/stencil/avatarBodyMarkup";
import CommentForm from "../scream/commentForm";
import BookmarkButton from "./bookmarkButton";
import Commments from "./comments";
import FollowButton from "./followButton";
import LikeButton from "./likeButton";
import CustomMenu from "./menu";

const styles = (theme) => ({
  ...theme.spreadThis,
  ...theme.fonts,
  ...theme.margins,
  cardContainer: {
    height: "100%",
    boxShadow: "0px 0px 0px 0px !important",
    overflow: "hidden",

    "& .MuiCardHeader-avatar": { marginRight: 5 },
  },
  cardHeader: {
    padding: 10,
    backgroundColor: "white",
    // position: "-webkit-sticky",
    position: "sticky",
    top: 0,
    borderColor: theme.palette.primary.darkFade,
    borderBottom: "1px solid ",
  },
  profileImage: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  expandButton: { position: "absolute", left: "90%" },
  spinnerDiv: { textAlign: "center", marginTop: 50, marginBottom: 50 },
  imgWrapper: { display: "flex", align: "center", justifyContent: "center" },
  postImage: { height: "100%", width: "100%" },
  profileAvatarText: {
    lineHeight: 0,
    display: "flex",
    alignItems: "center",
  },
  bodyWrapper: {
    marginBottom: 25,
    padding: 10,
    height: "100%",
    maxHeight: "100%",
    minHeight: "200px",
    overflow: "auto",
    wordWrap: "break-word",
  },
  cardActions: {
    padding: 0,
    backgroundColor: "white",
    width: "100%",
    borderColor: theme.palette.primary.darkFade,
    borderTop: "1px solid",
    position: "sticky",
    bottom: 0,
    display: "flex",
    flexDirection: "column",
  },
  actionsContainer: {
    position: "relative",
    width: "100%",
    borderColor: theme.palette.primary.darkFade,
    borderBottom: "1px solid",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
  },
  iconsContainer: { display: "flex", alignItems: "center" },
  postedAtLabel: { paddingBottom: 12, paddingLeft: 12, marginTop: -5 },
  bookMarker: { padding: 12, position: "absolute", right: 0 },
  commentsContainer: {
    height: 50,
    width: "100%",
  },
  avatarMarkup: {
    height: 200,
  },
  padding0: {
    padding: 0,
    paddingRight: 12,
  },
});

class ScreamDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      oldPath: "",
      newPath: "",
    };
  }

  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
    this.props.onRef(this);
  }

  componentWillMount() {
    this.props.onRef(undefined);
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
  handleClose = (event) => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({ open: false });
    this.props.clearErrors();
  };
  handleScroll = (event) => {
    const height = event.target.clientHeight;
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;

    if (
      scrollTop + height !== scrollHeight ||
      this.props.UI.loading ||
      !this.props.hasMore
    ) {
      return;
    }

    if (this.props.offset === 0) return;

    this.props.getComments(this.props.scream._id);
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
        comments,
        postContent: { url },
      },
      UI: { loading },
      isPicture,
      loadingPagination,
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} />
      </div>
    ) : (
      <Grid container style={{ overflowY: "hidden" }}>
        <Grid item sm={8} xs={12} container>
          <CardMedia
            className={classes.postImage}
            title="Post"
            alt="ExpandScream"
            component="img"
            image={url}
          />
        </Grid>
        <Grid item sm={4} xs={12} container onScroll={this.handleScroll}>
          <Grid item xs container direction="column">
            <Grid item xs>
              <Card className={classes.cardContainer}>
                <CardHeader
                  className={classes.cardHeader}
                  avatar={
                    <Avatar
                      className={classes.profileImage}
                      src={profilePhotoUrl}
                      alt="ProfileImage"
                    />
                  }
                  title={
                    <Fragment>
                      <div className={classes.profileAvatarText}>
                        <Typography
                          className={classes.fontWeight700}
                          style={{ marginRight: 4 }}
                          variant="body1"
                          color="inherit"
                          component={Link}
                          to={`/users/${userHandle}`}
                        >
                          {userHandle} •
                        </Typography>

                        <FollowButton handle={userHandle} type="text" />
                      </div>
                    </Fragment>
                  }
                  subheader={
                    <Typography variant="body2" color="textSecondary">
                      Location
                    </Typography>
                  }
                  action={
                    <CustomMenu
                      closeButton={this.handleClose}
                      screamId={_id}
                      userHandle={userHandle}
                    />
                  }
                />
                <CardContent className={classes.bodyWrapper}>
                  <Grid container>
                    <AvatarMarkup
                      className={classes.avatarMarkup}
                      body={body}
                      createdAt={dayjs(createdAt).fromNow()}
                      url={profilePhotoUrl}
                      userHandle={userHandle}
                    />
                  </Grid>

                  <Commments comments={comments} />
                </CardContent>

                <CardActions className={classes.cardActions}>
                  <div className={classes.actionsContainer}>
                    <span className={classes.iconsContainer}>
                      <LikeButton
                        screamId={_id}
                        className={classes.likeButton}
                      />
                      <MyButton
                        btnClassName={classes.padding0}
                        tip="Comment scream"
                      >
                        <ChatIcon color="primary" />
                      </MyButton>
                      <SendIcon color="primary" />

                      <BookmarkButton
                        isMenu={false}
                        screamId={_id}
                        className={classes.bookMarker}
                      />
                    </span>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className={classes.postedAtLabel}
                    >
                      Posted {dayjs(createdAt).fromNow()}
                    </Typography>
                  </div>
                  <div className={classes.commentsContainer}>
                    <CommentForm screamId={_id} />
                  </div>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );

    return (
      <Fragment>
        {/* <MyButton
          tip="Add comment"
          tip="Comment on scream"
          onClick={this.handleOpen}
        >
          <ChatIcon color="primary" />
        </MyButton> */}

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="md"
          className={classes.dialogRoot}
        >
          <DialogContent
            className={classes.dialogContent}
            style={{ padding: 0 }}
          >
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

ScreamDialog.propTypes = {
  getScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  screamId: PropTypes.string,
  userHandle: PropTypes.string,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  isPicture: PropTypes.bool,
  hasMore: PropTypes.bool,
  offset: PropTypes.number,
  getComments: PropTypes.func,
  loadingPagination: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.UI,
  hasMore: state.data.scream.commentPagination.hasNextPage,
  offset: state.data.scream.commentPagination.offset,
  loadingPagination: state.data.scream.loading,
});

const mapActionsToProps = { getScream, clearErrors, getComments };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ScreamDialog));
