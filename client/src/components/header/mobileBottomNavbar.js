import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// MUI
import {
  withStyles,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core";

// Components
import MyButton from "../util/myButton";

// Icons
import { AccountBox, Search, Home } from "@material-ui/icons";

// Redux
import { connect } from "react-redux";

import { setSearchPage, setHomePage } from "../../redux/actions/uiActions";

const styles = (theme) => ({
  appBar: {
    width: "100%",
    position: "fixed",
    display: "flex",
    flexGrow: 1,
    top: "auto",
    bottom: 0,
    backgroundColor: theme.palette.primary.dark,
    zIndex: 99,
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  iconColor: {
    color: "#ffffff",
  },
  padding: {
    paddingTop: "8px !important",
    paddingBottom: 8,
  },
});

const MobileBottomNavbar = (props) => {
  const { classes, userHandle, isSearchNavbar } = props;
  const [value, setValue] = React.useState(0);

  const handleSearchClick = () => {
    props.setSearchPage(!isSearchNavbar);
  };

  const handleHomeClick = () => {
    props.setSearchPage(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      className={classes.appBar}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        value="Home"
        onClick={handleHomeClick}
        className={classes.padding}
        icon={
          <Link to={"/home/followers"}>
            <Home className={classes.iconColor} />
          </Link>
        }
      />
      <BottomNavigationAction
        value="Search"
        onClick={handleSearchClick}
        className={classes.padding}
        icon={<Search className={classes.iconColor} />}
      />
      <BottomNavigationAction
        value="Profile"
        className={classes.padding}
        icon={<AccountBox className={classes.iconColor} />}
        component={Link}
        to={`/users/${userHandle}`}
      />
    </BottomNavigation>
  );
};

MobileBottomNavbar.propTypes = {
  classes: PropTypes.object.isRequired,
  isSearchNavbar: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  userHandle: state.user.userDetail.credentials.handle,
  isSearchNavbar: state.UI.isSearchNavbar,
});

const mapActionsToProps = { setSearchPage };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(MobileBottomNavbar));
