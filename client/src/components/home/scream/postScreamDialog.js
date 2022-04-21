import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

// redux
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  postScream,
  clearErrors,
  postScreamWithData,
} from "../../../redux/actions/dataActions";

// MUI
import {
  Dialog,
  DialogTitle,
  Button,
  withStyles,
  CircularProgress,
  DialogContent,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  CardMedia,
} from "@material-ui/core";

// ICONS

import {
  Add as AddIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  People,
  PostAdd,
} from "@material-ui/icons/";

// Components
import MyButton from "../../util/myButton";

// Util
import MimeType from "../../util/fileValidator/mimetype";
import UploadPicture from "../../util/fileValidator/uploadPicture";

const styles = (theme) => ({
  ...theme.spreadThis,
  ...theme.spreadCancelButtons,
  submitButton: { position: "relative", float: "right" },
  progressSpinner: { position: "absolute" },
  closeButton: { position: "absolute", left: "91%", top: "4%" },
  profilePic: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: -6,
  },
  root: { boxShadow: "0px 0px 0px 0px !important" },
  button: { padding: 3 },
  submitButton: { marginLeft: "auto !important" },
  input: { display: "none" },
  header: { paddingBottom: 0 },
  media: {
    width: "90%",
  },
  mediaWrappper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

class PostScream extends Component {
  state = {
    open: false,
    body: "",
    media: null,
    fileType: "",
    file: null,
    errors: {},
    fileErrors: {},
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      if (nextProps.UI.errors.fileError) {
        this.setState({
          fileErrors: nextProps.UI.errors,
        });
      } else {
        this.setState({ errors: nextProps.UI.errors });
      }
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({
        body: "",
        open: false,
        errors: {},
        file: null,
        type: "",
        media: null,
        fileErrors: "",
      });
    }
  }
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.props.clearErrors();
    this.setState({
      open: false,
      errors: "",
      file: null,
      type: "",
      media: null,
      fileErrors: "",
    });
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.file === null) {
      const fileError = { fileError: "You need to select a file!" };
      this.setState({
        fileErrors: fileError,
      });

      return;
    }

    this.props.postScreamWithData(this.state.body, this.state.file);
  };
  handleCancel = () => {
    this.setState({
      errors: "",
      body: "",
      file: null,
      media: null,
      fileErrors: "",
      fileType: "",
    });
  };
  handleUpload = (event) => {
    event.preventDefault();
    if (event.target.files[0] === undefined) return;
    const file = event.target.files[0];

    const mimetype = MimeType(file.type);

    if (mimetype === "unknownMimeType") {
      const fileError = { fileError: "You cannot upload " + file.type + "" };
      this.setState({
        fileErrors: fileError,
      });
      return;
    }

    Promise.resolve(UploadPicture(file))
      .then((res) => {
        this.setState({
          media: res,
          fileType: mimetype,
          file,
          fileErrors: "",
        });
      })
      .catch((err) => {
        console.log(err.message);
        const error = { error: err.message };
        this.setState({ errors: error });
      });
  };
  render() {
    const { errors, media, fileType, fileErrors } = this.state;
    const {
      classes,
      type,
      className,
      UI: { loading },
      handle,
      profilePhotoUrl,
      authenticated,
    } = this.props;

    const triggerType =
      type !== "text" ? (
        <MyButton onClick={this.handleOpen} tip="Post a Scream!">
          <AddIcon color="inherit" />
        </MyButton>
      ) : (
        <p onClick={this.handleOpen} className={className}>
          Scream at your homies!
        </p>
      );

    const cardMedia =
      media !== null ? (
        <CardMedia
          component={fileType}
          src={media}
          className={classes.media}
          title="Picture"
        />
      ) : null;

    let cardDialog = authenticated ? (
      <Card className={classes.root}>
        <CardHeader
          className={classes.header}
          avatar={
            <Avatar
              src={profilePhotoUrl}
              alt="profilePhoto"
              className={classes.profilePic}
              size="large"
            />
          }
          title={<Typography variant="h6">{handle}</Typography>}
          subheader={
            <Button
              className={classes.button}
              // variant="contained"
              size="small"
              startIcon={<People fontSize="small" />}
            >
              Friends
            </Button>
          }
        />

        <CardContent>
          <TextField
            name="body"
            type="text"
            label="Scream"
            multiline
            id="outlined-textarea"
            variant="outlined"
            rows="5"
            placeholder="Scream at your homies"
            error={errors.error ? true : false}
            helperText={errors.error}
            className={classes.textField}
            onChange={this.handleChange}
            value={this.state.body}
            disabled={loading}
            fullWidth
          />
        </CardContent>

        <span className={classes.mediaWrappper}>{cardMedia}</span>
      </Card>
    ) : (
      <Card className={classes.root}>
        <Typography variant="subtitle4" component={Link} to="/login">
          Login here to Scream at your homies!
        </Typography>
      </Card>
    );

    return (
      <Fragment>
        {triggerType}

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

          <DialogTitle>Post a new Scream!</DialogTitle>

          <DialogContent style={{ paddingBottom: authenticated ? 0 : 20 }}>
            {cardDialog}
          </DialogContent>

          {authenticated && (
            <CardActions>
              <input
                type="file"
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                onChange={this.handleUpload}
              />

              <label for="contained-button-file">
                <Button
                  variant={fileErrors.fileError ? "contained" : "text"}
                  color={fileErrors.fileError ? "secondary" : "inherit"}
                  className="classes.button"
                  startIcon={
                    <CloudUploadIcon
                      style={{
                        color: fileErrors.fileError ? "#ffffff" : "#46BE62",
                      }}
                    />
                  }
                  component="span"
                  disabled={loading}
                >
                  Upload file
                </Button>
              </label>

              {fileErrors.fileError && (
                <Typography variant="body2" color="secondary">
                  {fileErrors.fileError}
                </Typography>
              )}

              <Button
                type="submit"
                onClick={this.handleSubmit}
                className={classes.submitButton}
                color="primary"
                startIcon={<PostAdd />}
                disabled={loading}
              >
                Post Scream!
                {loading && (
                  <CircularProgress
                    size={30}
                    className={classes.progressSpinner}
                  />
                )}
              </Button>
              {/* </form> */}
            </CardActions>
          )}
        </Dialog>
      </Fragment>
    );
  }
}

PostScream.propTypes = {
  postScream: PropTypes.func.isRequired,
  postScreamWithData: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  handle: PropTypes.string,
  profilePicture: PropTypes.string,
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  handle: state.user.userDetail.credentials.handle,
  profilePhotoUrl: state.user.userDetail.credentials.profilePicture.url,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, {
  postScream,
  clearErrors,
  postScreamWithData,
})(withStyles(styles)(PostScream));
