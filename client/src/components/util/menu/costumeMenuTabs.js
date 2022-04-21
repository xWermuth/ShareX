import React, { Component } from "react";

// MUI
import { Menu, MenuItem, withStyles } from "@material-ui/core";

export const StyledMenu = withStyles({
  paper: { border: "1px solid #d3d4d5" },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

export const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      // backgroundColor: "rgba(0, 0, 0, 0.2)",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        // color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);
