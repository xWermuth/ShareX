import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// REDUX
import { connect } from "react-redux";
import { signUpUser } from "../redux/actions/userActions";
import { setHomePage } from "../redux/actions/uiActions";

//MUI
import {
  Grid,
  withStyles,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";

import TogglePrivacyBtn from "../components/auth/togglePrivacy";

import Icon from "../resources/donut.svg";

const styles = (theme) => ({
  ...theme.spreadThis,
  togglePrivacyContainer: {
    marginTop: 10,
    padding: "0px 5px",
    width: "100%",
    color: "#7D7D7D",
    borderBottom: "1px solid #E9E9E9",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

class signup extends Component {
  constructor(props) {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      handle: "",
      privacy: false,
      errors: {},
    };
  }

  componentDidMount() {
    let isHomePage = false;
    this.props.setHomePage(isHomePage);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    if (this.state.password !== this.state.confirmPassword) {
      const error = {
        general: "Passwords doesn't match. Try again!",
        password: " ",
        confirmPassword: " ",
      };
      this.setState({ errors: error, loading: false });
      return;
    }

    const newUser = {
      email: this.state.email,
      password: this.state.password,
      handle: this.state.handle,
      privacy: this.state.privacy,
    };

    this.props.signUpUser(newUser, this.props.history);
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;

    return (
      <Grid container className={classes.form} style={{ paddingTop: 80 }}>
        <Grid item sm />
        <Grid item sm>
          <img src={Icon} alt="logo" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
            Signup
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange}
              helperText={errors.email}
              error={errors.email ? true : false}
              fullWidth
            />

            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange}
              helperText={errors.password}
              error={errors.password ? true : false}
              fullWidth
            />

            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              className={classes.textField}
              value={this.state.confirmPassword}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              onChange={this.handleChange}
              fullWidth
            />

            <TextField
              id="handle"
              name="handle"
              type="text"
              label="Username"
              className={classes.textField}
              value={this.state.handle}
              onChange={this.handleChange}
              helperText={errors.handle}
              error={errors.handle ? true : false}
              fullWidth
            />

            <div className={classes.togglePrivacyContainer}>
              <TogglePrivacyBtn
                private={this.state.privacy}
                handleChange={(privacy) => this.setState({ privacy: privacy })}
              />
            </div>

            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Signup
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>

            <br />

            <small>
              Already have an account? Login{" "}
              <Link to="/login">
                {" "}
                <span style={{ color: "blue" }}>here</span>
              </Link>
            </small>
          </form>
          <br />
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signUpUser: PropTypes.func.isRequired,
  setHomePage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps, { signUpUser, setHomePage })(
  withStyles(styles)(signup)
);
