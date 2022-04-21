import { useCallback, useState } from "react";
import PropTypes from "prop-types";

export const useConfirmationDialog = (confirmationCb) => {
  const [confirmationDialogState, setConfirmationDialogState] = useState({
    isOpen: false,
    handle: "",
  });

  const handleOnExit = useCallback(
    () =>
      setConfirmationDialogState((state) => ({ ...state, handle: undefined })),
    []
  );

  const handleOnClose = useCallback(
    () => setConfirmationDialogState((state) => ({ ...state, isOpen: false })),
    []
  );

  const handleOnOpen = useCallback(
    (handle) => setConfirmationDialogState({ isOpen: true, handle }),
    []
  );

  const handleOnConfirm = useCallback(
    (isConfirmed) => {
      if (isConfirmed && confirmationDialogState.handle) {
        handleOnClose();
        return confirmationCb(confirmationDialogState.handle);
      }
      handleOnClose();
    },
    [confirmationCb, handleOnClose, confirmationDialogState.handle]
  );

  return {
    confirmationHandle: confirmationDialogState.handle,
    isConfirmationOpen: confirmationDialogState.isOpen,
    handleOnExit,
    handleOnClose,
    handleOnOpen,
    handleOnConfirm,
  };
};

useConfirmationDialog.propTypes = {
  handle: PropTypes.func,
};
