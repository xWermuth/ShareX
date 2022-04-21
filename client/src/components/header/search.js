import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// axios
import axios from "axios";

// Redux
import { connect } from "react-redux";

// MUI
import {
  withStyles,
  Paper,
  InputBase,
  TextField,
  Menu,
  ListItemText,
  Typography,
  Avatar,
  ListItemAvatar,
  Link,
} from "@material-ui/core";
import { useAutocomplete, Autocomplete } from "@material-ui/lab";

// Icons
import { Search as SearchIcon } from "@material-ui/icons";

// components
import { StyledMenu, StyledMenuItem } from "../util/menu/costumeMenuTabs";
import CustomAutocomplete from "./autoComplete";

const styles = (theme) => ({
  searchField: {
    padding: "4px 12px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    height: "65%",
    backgroundColor: theme.palette.secondary.light,
    [theme.breakpoints.down("sm")]: {
      width: "60%",
    },
  },
  input: {
    width: "100%",
    padding: 0,
    margin: 0,
    display: "flex",
    justifyContent: "center",
  },
  searchIcon: {
    marginRight: 5,
    color: theme.palette.primary.dark,
  },
  textField: { margin: "0px !important", padding: "0 !important" },
  menu: {
    width: "100%",
  },
});

class Search extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Paper className={classes.searchField}>
          <SearchIcon className={classes.searchIcon} />

          <CustomAutocomplete />
        </Paper>
      </Fragment>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);
