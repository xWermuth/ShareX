import React, { Component } from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { submitComment, clearErrors } from "../../../redux/actions/dataActions";

// MUI
import {
  withStyles,
  Typography,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";

const styles = (theme) => ({
  ...theme.spreadThis,
  ...theme.spreadCancelButtons,
  inputFieldWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  profileImg: {
    marginRight: 10,
    width: 50,
    height: 50,
    maxWidth: 50,
    objectFit: "cover",
    borderRadius: "50%",
  },
  textField: {
    marginBottom: "5%",
    borderBtop: "1px solid rgba(0, 0, 0, 0.1)",
  },
  button: { margin: 0 },
  buttonWrapper: {
    ...theme.spreadCancelButtons.buttonWrapper,
    marginTop: -20,
  },
});

class commentForm extends Component {
  state = { body: "", errors: "" };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.clearErrors();
    this.props.submitComment(this.props.screamId, { body: this.state.body });
  };
  handleClick = (event) => {
    this.setState({ body: "" });
    this.props.clearErrors();
  };
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "", errors: "" });
    }
  };

  render() {
    const { classes, authenticated, profileImage } = this.props;
    const errors = this.state.errors;

    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center", marginTop: 20 }}>
        <form onSubmit={this.handleSubmit}>
          <div className={classes.inputFieldWrapper}>
            <img
              src={profileImage}
              alt="ProfileImage"
              className={classes.profileImg}
            />
            <TextField
              name="body"
              type="text"
              label="Comment on scream"
              color="primary"
              error={errors.comment ? true : false}
              helperText={errors.comment}
              value={this.state.body}
              onChange={this.handleChange}
              fullWidth
              className={classes.textField}
            />
          </div>
          <div className={classes.buttonWrapper}>
            <Button
              type="button"
              className={classes.button}
              className={classes.cancelButton}
              onClick={this.handleClick}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Submit
            </Button>
          </div>
        </form>
        {/* <hr className={classes.visibleSeparator} /> */}
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

commentForm.propTypes = {
  submitComment: PropTypes.func,
  clearErrors: PropTypes.func,
  UI: PropTypes.object,
  authenticated: PropTypes.bool,
  classes: PropTypes.object,
  screamId: PropTypes.string,
  profileImage: PropTypes.string,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
  profileImage: state.user.userDetail.credentials.profilePicture.url,
});

export default connect(mapStateToProps, { submitComment, clearErrors })(
  withStyles(styles)(commentForm)
);
