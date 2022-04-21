import React from "react";
import PropTypes from "prop-types";
import { useNotifications } from "../../hooks/useNotifications";
import { addChatNotification } from "../../redux/actions/chatAction";
import { connect } from "react-redux";

const NotificationProvider = ({
  userId,
  addChatNotification,
  authenticated,
}) => {
  useNotifications(authenticated, userId, addChatNotification);
  return <></>;
};

NotificationProvider.propTypes = {
  userId: PropTypes.string.isRequired,
  addChatNotification: PropTypes.func.isRequired,
  authenticated: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userId: state.user._id,
  authenticated: state.user.authenticated,
});

const mapActionsToProps = {
  addChatNotification,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(NotificationProvider);
