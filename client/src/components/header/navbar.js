import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";

//MUI framework
import { AppBar, Toolbar, Button, withStyles } from "@material-ui/core";

// components
import MyButton from "../util/myButton";
import PostScream from "../home/scream/postScreamDialog";
import Notifications from "./notifications";
import MyTabs from "./myTabs";
import SearchBar from "./search";
import MobileMenu from "./mobileMenu";
import MobileBottomNavbar from "./mobileBottomNavbar";
import Logout from "../util/logout";
import ChatSidebar from "../chat/sideChatBar";

import { AccountBox as ProfileIcon, Polymer } from "@material-ui/icons/";

const styles = (theme) => ({
  nav: {
    height: 64,
    backgroundColor: theme.palette.primary.dark,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "fixed",
    bottom: 0,
  },
  rightContainer: {
    display: "flex",
    position: "absolute",
    right: 72,
    "& svg": {
      color: theme.palette.primary.icon,
    },
    [theme.breakpoints.down("md")]: {
      padding: 0,
    },
  },
  leftContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 20,
    [theme.breakpoints.down("md")]: {
      justifyContent: "flex-start",
    },
  },

  logoIcon: {
    marginRight: 20,
    [theme.breakpoints.down("md")]: {
      padding: 0,
    },
  },
  buttons: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  searchIcon: {
    marginRight: 5,
    color: theme.palette.primary.dark,
  },
  iconColor: {
    color: theme.palette.primary.icon,
  },
  displayNoneScreenSm: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
});

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      user: {
        authenticated,
        userDetail: {
          credentials: { handle },
        },
      },
      classes,
      isSearchNavbar,
    } = this.props;

    const mobileNav = isSearchNavbar ? <SearchBar /> : <MyTabs />;

    return (
      <Fragment>
        <AppBar position="fixed" className={classes.nav}>
          <div className={classes.leftContainer}>
            <Link to="/">
              {/* @ts-ignore */}
              <MyButton tip="Home" tipClassName={classes.logoIcon}>
                <Polymer style={{ color: "#ffffff" }} />
              </MyButton>
            </Link>

            <span className={classes.displayNoneScreenSm}>
              <SearchBar />
            </span>
          </div>

          {mobileNav}
          {/* <MyTabs /> */}

          <Toolbar className={classes.rightContainer}>
            {authenticated ? (
              <Fragment>
                <div className={classes.buttons}>
                  {/* @ts-ignore */}
                  <PostScream type="icon" />
                  <Link to={`/users/${handle}`}>
                    {/* @ts-ignore */}
                    <MyButton tip="Profile">
                      <ProfileIcon color="primary" />
                    </MyButton>
                  </Link>

                  <Notifications />

                  <Logout />
                </div>

                <MobileMenu />
              </Fragment>
            ) : (
              <Fragment>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Signup
                </Button>
              </Fragment>
            )}
          </Toolbar>
        </AppBar>
        <ChatSidebar className={classes.buttons} />

        <MobileBottomNavbar />
      </Fragment>
    );
  }
}

Navbar.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  isSearchNavbar: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  isSearchNavbar: state.UI.isSearchNavbar,
});

/* @ts-ignore */
export default connect(mapStateToProps)(withStyles(styles)(Navbar));
