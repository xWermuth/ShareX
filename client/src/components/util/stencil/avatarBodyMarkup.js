import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// MUI
import { withStyles, Typography, Grid, Avatar } from "@material-ui/core";

const styles = (theme) => ({
  ...theme.fonts,
  ...theme.paddings,
  ...theme.margins,
});

const AvatarBodyMarkup = (props) => {
  const { url, createdAt, className, userHandle, body, classes } = props;

  return (
    <Fragment key={createdAt}>
      <Grid item sm={2} xs={2} className={classes.padding0}>
        <Avatar src={url} alt="profilePicture" />
      </Grid>
      <Grid item sm={9} xs={10} style={{ padding: 0, marginBottom: 15 }}>
        <Typography variant="body1" className={classes.marginBottom5}>
          <span className={classes.fontWeight700}>{userHandle}</span> {body}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {createdAt}
        </Typography>
      </Grid>
      <Grid
        item
        sm={12}
        xs={12}
        style={{ padding: 0, marginBottom: 15 }}
      ></Grid>
    </Fragment>
  );
};

AvatarBodyMarkup.propTypes = {
  userHandle: PropTypes.string,
  url: PropTypes.string,
  body: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object,
};

export default withStyles(styles)(AvatarBodyMarkup);
