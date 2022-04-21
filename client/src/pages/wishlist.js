import React from "react";
import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  withStyles,
  Theme,
  Typography,
  Link,
  Grid,
} from "@material-ui/core";

import { Link as LinkIcon } from "@material-ui/icons";
import { getWishes } from "../utils/wishlist/generateWishses";

const styles = (theme) => ({
  gridRoot: { paddingTop: 80 },
  root: {
    maxWidth: 500,
    width: "fit-content",
    display: "flex",
  },

  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  media: {
    height: "100%",
    width: 151,
  },
  justify: {
    display: "flex",
    justifyContent: "center",
  },
});

const WhishList = (props) => {
  const { classes } = props;

  const cardMarkup = getWishes().map((wish, index) => {
    return (
      <Grid item key={index} className={classes.justify}>
        <Card className={classes.root}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                {wish.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {wish.discription}
              </Typography>
            </CardContent>
            <div className={classes.footer}>
              <IconButton aria-label="link">
                <LinkIcon />
              </IconButton>
              <Link href={wish.link} underline="hover">
                Link to store
              </Link>
            </div>
          </div>

          <CardMedia
            className={classes.media}
            title="Something"
            component="img"
            alt="product"
            src={wish.image}
          />
        </Card>
      </Grid>
    );
  });

  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      spacing={3}
      className={classes.gridRoot}
    >
      {cardMarkup}
    </Grid>
  );
};

WhishList.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(WhishList);
