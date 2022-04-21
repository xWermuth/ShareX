import React from "react";
import PropTypes from "prop-types";

import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  CardHeader,
  Avatar,
} from "@material-ui/core";

const ConfirmationDialog = (props) => {
  const { onClose, onExited, isOpen, message, profilePic } = props;

  const handleCancel = () => {
    onClose(false);
  };
  const handleOk = () => {
    onClose(true);
  };
  return (
    <Dialog
      disableEscapeKeyDown
      open={isOpen}
      onExited={onExited}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{message}</DialogTitle>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>

        <Button onClick={handleOk} color="secondary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onExited: PropTypes.func,
  message: PropTypes.string,
  profilePic: PropTypes.string,
};

export default ConfirmationDialog;
