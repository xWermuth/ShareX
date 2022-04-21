import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import { withStyles, Tabs, Tab } from "@material-ui/core";

// Icons
import { Bookmark, Apps } from "@material-ui/icons";

const styles = (theme) => ({
  root: {
    maxWidth: 960,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    paddingBottom: 0,
    paddingTop: 0,
    borderColor: "#707e94",
    borderTop: "1px solid",
    position: "relative",

    "& .PrivateTabIndicator-root-20": {
      top: 0,
      height: 2,
      backgroundColor: theme.palette.primary.dark,
      zIndex: 99,
    },
    "&  .Mui-selected": {
      color: theme.palette.primary.dark,
      "& .MuiTab-wrapper": { "& svg": { color: theme.palette.primary.dark } },
    },
    "& .MuiTab-root": { paddingBottom: 0 },
  },

  defaultColor: { color: "#8E8E8E", paddingBottom: 0 },
});

const BookmarkedScreams = (props) => {
  const { classes } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Tabs
      value={value}
      orientation="horizontal"
      position="top"
      variant="standard"
      centered={true}
      className={classes.root}
      onChange={handleChange}
    >
      <Tab
        icon={
          <Fragment>
            <Apps
              fontSize="small"
              color="primary"
              label="BOOKMARKED"
              className={classes.defaultColor}
            />
            Screams
          </Fragment>
        }
      />
      <Tab
        icon={
          <Fragment>
            <Bookmark
              fontSize="small"
              color="primary"
              label="SCREAMS"
              className={classes.defaultColor}
            />
            Bookmarks
          </Fragment>
        }
      />
    </Tabs>
  );
};

BookmarkedScreams.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BookmarkedScreams);
