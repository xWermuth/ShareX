import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { submitComment, clearErrors } from "../../../redux/actions/dataActions";

// Components
import { validataBodyLength } from "../../util/textValidators/bodyLengthValidator";

// MUI
import { withStyles, Typography, Button } from "@material-ui/core";

const styles = (theme) => ({
  ...theme.spreadThis,
  ...theme.spreadCancelButtons,
  inputFieldWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    overflowX: "hidden",
  },
  textField: {
    padding: "0 5px 0 5px",
    outline: "none",
    textDecoration: "none",
    fontSize: 15,
    width: "80%",
    height: "50%",
    maxWidth: "80%",
    maxHeight: "100%",
    overflow: "auto",
  },
  submit: {
    fontWeight: 700,
    maxWidth: "20%",
  },
  errorText: {
    position: "absolute",
    top: "40%",
    right: "5%",
  },
});

function pushTextUpwards() {
  const textArea = document.getElementById("textArea");
  textArea.style.height = 0;
  textArea.style.height = textArea.scrollHeight + "px";
}

class commentForm extends Component {
  state = { body: "", errors: "" };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });

    pushTextUpwards();
  };
  handleSubmit = (event) => {
    event.preventDefault();

    const maxLength = 300;
    const isValid = validataBodyLength(this.state.body, maxLength);
    if (isValid) {
      this.setState({ errors: isValid });
      return;
    }

    this.props.clearErrors();
    this.props.submitComment(this.props.screamId, { body: this.state.body });
    this.setState({ body: "", errors: "" });
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
      <div className={classes.inputFieldWrapper}>
        <form
          onSubmit={this.handleSubmit}
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <textarea
            name="body"
            type="text"
            className={classes.textField}
            onChange={this.handleChange}
            id="textArea"
            placeholder="Add a comment..."
            value={this.state.body}
          />

          <Button type="submit" className={classes.submit} color="primary">
            Post
          </Button>
          <Typography
            variant="body2"
            color="secondary"
            className={classes.errorText}
          >
            {errors.error ? errors.error : null}
          </Typography>
        </form>
      </div>
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
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { submitComment, clearErrors })(
  withStyles(styles)(commentForm)
);
