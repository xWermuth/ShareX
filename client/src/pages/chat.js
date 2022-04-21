// @ts-nocheck
import React, { Fragment, useCallback, useState, useRef } from "react";

import { connect } from "react-redux";

import { withStyles } from "@material-ui/core";

const style = (theme) => ({});

export const Chat = React.memo((props) => {
  return (
    <div style={{ paddingTop: 80, margin: "0 auto", textAlign: "center" }}>
      <h3>Chat page</h3>
      <small>Coming soon...</small>
    </div>
  );
});

Chat.propTypes = {};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(style)(Chat));
