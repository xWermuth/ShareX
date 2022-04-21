import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

// MUI
import {
  Dialog,
  DialogTitle,
  Button,
  withStyles,
  DialogActions,
} from "@material-ui/core";

// Components
import MyButton from "../../util/myButton";

// Icons
import { DeleteOutline } from "@material-ui/icons";

// Redux
import { connect } from "react-redux";
import { deleteScream } from "../../../redux/actions/dataActions";

import PropTypes from "prop-types";

const styles = {
  deleteButton: {
    position: "absolute",
    left: "90%",
    top: "1%",
  },
};

class DeleteRattle extends Component {
  state = {
    open: false,
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  deleteScream = () => {
    this.props.deleteScream(this.props.screamId);
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Delete scream"
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutline color="secondary" />
        </MyButton>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Are you sure you want to delete this scream?
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>

              <Button onClick={this.deleteScream} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </DialogTitle>
        </Dialog>
      </Fragment>
    );
  }
}

DeleteRattle.propTypes = {
  deleteScream: PropTypes.func,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
};

export default connect(null, { deleteScream })(
  withStyles(styles)(DeleteRattle)
);
