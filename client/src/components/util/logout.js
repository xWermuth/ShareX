import React from "react";
import PropTypes from "prop-types";

// MUI
import { ExitToApp } from "@material-ui/icons";

// Components
import MyButton from "./myButton";

// Redux
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";

const Logout = (props) => {
  const handleClick = () => {
    props.logoutUser();
  };

  return (
    <MyButton onClick={handleClick} tip="Logout">
      <ExitToApp />
    </MyButton>
  );
};

Logout.propTypes = {
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = { logoutUser };

export default connect(mapStateToProps, mapActionsToProps)(Logout);
