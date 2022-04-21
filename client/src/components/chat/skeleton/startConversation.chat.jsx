import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { ChatOutlined } from "@material-ui/icons";

const styles = (theme) => ({
  wrapper: {
    padding: 20,
    flex: "1 1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#BEBEC0",
    width: theme.spacing(14),
    height: theme.spacing(14),
  },
  text: {
    marginTop: 10,
    color: "rgba(0, 0, 0, 0.54)",
    fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
    textAlign: "center",
  },
});

const StartConversation = ({ classes, hasFollowers }) => {
  return (
    <div className={classes.wrapper}>
      <ChatOutlined color="inherit" className={classes.icon} />
      <Typography variant="body1" className={classes.text}>
        Select homie to start conversation
      </Typography>
      <small>Your following will appear here</small>
      {hasFollowers && <small>Start following to chat!</small>}
    </div>
  );
};

StartConversation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StartConversation);
