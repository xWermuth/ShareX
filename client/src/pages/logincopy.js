import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// REDUX
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";
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

import Icon from "../resources/donut.svg";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class loginCopy extends Component {
  constructor(props) {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
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

    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(user, this.props.history);
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
            Login
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
              Login
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>

            <br />

            <small>
              Don't have an account? Sign up{" "}
              <Link to="/signup">
                <span style={{ color: "blue" }}>here</span>
              </Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

loginUser.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  setHomePage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  loginUser,
  setHomePage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(loginCopy));
