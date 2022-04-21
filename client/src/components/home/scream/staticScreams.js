import React, { Component, Fragment } from "react";
import $ from "jquery";

import PropTypes from "prop-types";

// MUI
import { withStyles, Grid } from "@material-ui/core";

import { Info as InfoIcon } from "@material-ui/icons";

// components
import ScreamDialog from "./screamDialog";

const styles = (theme) => ({
  // gridList: { padding: "0px 30px 0 30px", width: "100%", maxWidth: 800 },

  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },

  image: {
    objectFit: "cover",
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    padding: "3%",
    cursor: "pointer",
    [theme.breakpoints.up("md")]: {
      padding: 15,
    },
    [theme.breakpoints.down("md")]: {
      padding: "3%",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "1%",
    },
  },
  tileContainer: {},
  "& .tileImgContainer": { width: "20%" },
});

function resizeTiles() {
  let tiles = document.getElementsByClassName("tileImgContainer");

  for (var i = 0; i < tiles.length; i++) {
    let width = $(tiles[i]).width();
    $(tiles[i]).height(width);
  }
}

class StaticScreams extends Component {
  componentDidMount() {
    let tiles = document.getElementsByClassName("tileImgContainer");

    for (let i = 0; i < tiles.length; i++) {
      let width = $(tiles[i]).width();
      $(tiles[i]).height(width);
    }
    window.addEventListener("resize", resizeTiles);
  }
  onClick = () => {
    this.child.handleOpen();
  };

  render() {
    const { url, userHandle, screamId } = this.props;

    const { classes } = this.props;

    return (
      <Grid item xs={4} sm={4} key={screamId} className="tileImgContainer">
        <img
          onClick={this.onClick}
          src={url}
          alt={url}
          className={classes.image}
        />

        <ScreamDialog
          onRef={(ref) => (this.child = ref)}
          screamId={screamId}
          openDialog={this.props.openDialog}
          userHandle={userHandle}
        />
      </Grid>
    );
  }
}

StaticScreams.propTypes = {
  url: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  screamId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

export default withStyles(styles)(StaticScreams);
