import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// React router dom
import { Route, Switch, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

// REDUX
import { connect } from "react-redux";
import {
  getAllScreams,
  getScreamsFromFollowers,
} from "../../redux/actions/dataActions";

// Component
import MyButton from "../util/myButton";

// MUI
import {
  Button,
  withStyles,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Tooltip,
} from "@material-ui/core";

import MuiLink from "@material-ui/core/Link/Link";

// Icons
import AddIcon from "@material-ui/icons/Add";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Polymer,
  Apps,
  FeaturedPlayList as ScreamIcon,
} from "@material-ui/icons/";

const styles = (theme) => ({
  feed: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  iconColor: {
    color: theme.palette.primary.icon,
    fontSize: "30px !important",
    disableRipple: true,
  },
  button: { outline: "none" },
});

class MyTabs extends Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  state = {
    selectedTab: 0,
  };

  componentDidMount() {
    const homePageToIndex = { following: 0, forYouPage: 1 };

    const page = localStorage.getItem("home_page");

    // In case if no page is stored
    if (page === undefined) {
      this.setState({ selectedTab: 0 });
    } else {
      this.setState({ selectedTab: homePageToIndex[page] });
    }
  }

  handleChange = (event, newValue) => {
    const indexToHomePage = { 0: "following", 1: "forYouPage" };

    if (
      localStorage.getItem("home_page") === "following" &&
      indexToHomePage[newValue] === "following"
    ) {
      return;
    } else if (
      localStorage.getItem("home_page") === "forYouPage" &&
      indexToHomePage[newValue] === "forYouPage"
    ) {
      return;
    }

    const isScrolling = false;

    indexToHomePage[newValue] === "following"
      ? this.props.getScreamsFromFollowers(isScrolling)
      : this.props.getAllScreams(isScrolling);

    localStorage.setItem("home_page", indexToHomePage[newValue]);
    this.setState({ selectedTab: newValue });
    window.scrollTo(0, 0);
  };

  render() {
    const {
      classes,
      UI: { isHomePage },
    } = this.props;
    const { selectedTab } = this.state;

    return (
      <Fragment>
        <Tabs
          value={selectedTab}
          onChange={this.handleChange}
          aria-label="Choose feeds"
          variant="fullWidth"
          className={classes.feed}
          textColor="inherit"
          // indicatorColor={isHomePage ? "secondary" : "primary"}
        >
          <Tab
            icon={
              <Fragment>
                <Link
                  to="/home/following"
                  style={{ width: "100%", height: "100%" }}
                >
                  <Tooltip
                    ref={this.wrapper}
                    title="Following"
                    placement="bottom"
                  >
                    <ScreamIcon />
                  </Tooltip>
                </Link>
              </Fragment>
            }
          />

          <Tab
            icon={
              <Fragment>
                <Link
                  to="/home/forYouPage"
                  style={{ width: "100%", height: "100%" }}
                >
                  <Tooltip title="For you" placement="bottom">
                    <Apps />
                  </Tooltip>
                </Link>
              </Fragment>
            }
          />
        </Tabs>
      </Fragment>
    );
  }
}

MyTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  getScreamsFromFollowers: PropTypes.func.isRequired,
  getAllScreams: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
});

const mapActionsToProps = {
  getScreamsFromFollowers,
  getAllScreams,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(MyTabs));
