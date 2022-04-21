import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AvatarMarkup from "../../util/stencil/avatarBodyMarkup";

// MUI
import { withStyles, Grid } from "@material-ui/core";

const styles = (theme) => ({
  ...theme.spreadThis,
  gridContainer: {},
  commentImage: {
    width: 50,
    height: 50,
    maxWidth: "100%",

    objectFit: "cover",
    borderRadius: "50%",
  },
  commentData: {
    marginLeft: 0,
  },
  userInfo: { display: "flex", alignItems: "center", marginBottom: -5 },
  visibleSeperatorMarginTop: {
    marginTop: 10,
  },
  imgWrapper: {
    width: 70,
    height: "100%",
    padding: "0px !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  gridComment: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  addSpace: {
    paddingBottom: 30,
  },
});

class Comments extends Component {
  render() {
    dayjs.extend(relativeTime);
    const { comments, classes } = this.props;
    return (
      <Grid container style={{ height: 2 }}>
        {comments.map((comment, index) => {
          const { body, createdAt, imageUrl, userHandle } = comment;
          return (
            <Fragment key={index}>
              <AvatarMarkup
                body={body}
                createdAt={dayjs(createdAt).fromNow()}
                url={imageUrl}
                userHandle={userHandle}
              />
              {index === comments.length - 1 && (
                <div style={{ padding: 95 }}></div>
              )}
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}

Comments.propTypes = {
  comments: PropTypes.array,
};

export default withStyles(styles)(Comments);
