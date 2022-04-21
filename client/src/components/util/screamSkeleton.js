import React, { Component, Fagment, Fragment } from "react";
import PropTypes from "prop-types";

// MUI
import {
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  withStyles,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

const defaultImage =
  "https://sharex-1.s3-eu-west-1.amazonaws.com/defaultProfilePic.png";

const styles = (theme) => ({
  ...theme.spreadThis,
  card: { marginBottom: 20, maxWidth: 500, margin: theme.spacing(2) },
  media: {
    height: 500,
  },
});

const ScreamSkeleton = (props) => {
  const { classes } = props;

  const content = Array.from({ length: 2 }).map((_, index) => (
    <Card className={classes.card} key={index}>
      <CardHeader
        avatar={
          <Skeleton variant="circle" animation="wave" width={40} height={40} />
        }
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="80%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
      <Skeleton variant="rect" className={classes.media} />
      <CardContent>
        <Skeleton animation="wave" height={10} style={{ marginBottom: 10 }} />
        <Skeleton animation="wave" height={10} width="40%" />
      </CardContent>
    </Card>
  ));

  return <Fragment>{content}</Fragment>;
};

ScreamSkeleton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScreamSkeleton);
