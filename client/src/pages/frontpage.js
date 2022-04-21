import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setHomePage } from "../redux/actions/uiActions";

import { Paper, withStyles, Typography, Button } from "@material-ui/core";

import Wave from "../components/util/wave";

const bg_picture = "https://sharex-1.s3-eu-west-1.amazonaws.com/bg_sharex.jpeg";

const styles = (theme) => ({
  root: {
    paddingTop: 64,
    margin: 0,
    width: "100%",
    height: 900,

    background: `url(${bg_picture})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  overlay: {
    transition: ".3s",
    background: "rgba(27, 27, 27, 0.5)",
    width: "100%",
    height: 900,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  group: {
    margin: "0 auto",
    maxWidth: "500px",
    padding: "200px 50px",
    textAlign: "center",
    color: "#ffffff",
  },
});

class FrontPage extends Component {
  componentDidMount() {
    let isHomePage = false;
    this.props.setHomePage(isHomePage);
  }
  render() {
    const { classes, authenticated } = this.props;

    const btnMarkup = authenticated ? (
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: 30 }}
        component={Link}
        to={"/home/forYouPage"}
      >
        Explore for you page!
      </Button>
    ) : (
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: 30 }}
        component={Link}
        to={"/signup"}
      >
        Signup here!
      </Button>
    );
    return (
      <Fragment>
        <Paper elevation={0} className={classes.root}>
          <div className={classes.overlay}>
            <div className={classes.group}>
              <Typography variant="h3">
                <b>Share-X</b>
              </Typography>
              <Typography variant="body1">
                Share moments with friends and family in an instance!
              </Typography>
              {btnMarkup}
            </div>
          </div>
          <Wave style={{ position: "absolute", top: 750 }} />
        </Paper>
      </Fragment>
    );
  }
}

FrontPage.propTypes = {
  setHomePage: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

const mapActionsToProps = {
  setHomePage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(FrontPage));
