import React from "react";
import PropTypes from "prop-types";

// MUI
import { withStyles, Grid, Avatar } from "@material-ui/core";
import { DEFAULT_IMAGE, MAX_WIDTH_FOR_SYSTEM as MAX_WIDTH } from "./config";
import { Skeleton } from "@material-ui/lab";
import clsx from "clsx";

//icons
import {
  LocationOn,
  CalendarToday,
  Link as LinkIcon,
} from "@material-ui/icons";
// import LinkIcon from "@material-ui/icons/Link";

const styles = (theme) => ({
  ...theme.spreadProfile,
  ...theme.margins,
  root: { maxWidth: MAX_WIDTH },
  handle: {
    height: 20,
    backgroundColor: theme.palette.primary.main,
    width: 60,
    margin: "0px auto 7px auto",
  },
  imgSize: {
    width: theme.spacing(18),
    height: theme.spacing(18),
  },
  fullLine: {
    height: 15,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  halfLine: {
    height: 15,
    width: "50%",
    marginBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  userBio: {
    paddingTop: 20,
  },
  bioItem: {
    display: "flex",
    flexDirection: "row",
    paddingBottom: 5,
    alignItems: "center",
  },
});

const ProfileSkeleton = (props) => {
  const { classes } = props;
  return (
    <Grid container spacing={3} justify="center" className={classes.root}>
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
        <span className={classes.profileImageBorder}>
          <Avatar
            src={DEFAULT_IMAGE}
            alt="profile_img"
            className={classes.imgSize}
          />
        </span>
      </Grid>
      <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
        <Grid container alignItems="flex-start">
          <Grid item xs={4} sm={4} md={4} lg={4} xl={4} alignItems="flex-start">
            <Skeleton animation="pulse" variant="text" height={20} />
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            lg={8}
            xl={8}
            alignItems="flex-start"
          />
          <Grid item xs={12} sm={12} md={12} lg={12} alignItems="flex-start">
            <div className={classes.userBio}>
              <div className={classes.bioItem}>
                <LocationOn
                  color="primary"
                  className={clsx(classes.marginRight5, classes.ml5)}
                />{" "}
                <Skeleton
                  animation="pulse"
                  variant="text"
                  height={10}
                  width="20%"
                />
              </div>

              <div className={classes.bioItem}>
                <LinkIcon
                  color="primary"
                  className={clsx(classes.ml5, classes.marginRight5)}
                />
                <Skeleton
                  animation="wave"
                  variant="text"
                  height={10}
                  width="25%"
                />
                <hr />
              </div>

              <div className={classes.bioItem}>
                <CalendarToday
                  color="primary"
                  className={clsx(classes.marginRight5, classes.ml5)}
                />
                <Skeleton
                  animation="wave"
                  variant="text"
                  height={10}
                  width="15%"
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

ProfileSkeleton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileSkeleton);
