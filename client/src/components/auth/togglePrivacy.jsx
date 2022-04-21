import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { FormControlLabel, Switch } from "@material-ui/core";

const TogglePrivacyBtn = (props) => {
  const handleChange = () => {
    props.handleChange(!props.private);
  };

  return (
    <FormControlLabel
      control={<Switch color="secondary" />}
      checked={props.privacy}
      onChange={handleChange}
      name="checkPrivacy"
      label={props.privacy ? "Private" : "Public"}
    />
  );
};

TogglePrivacyBtn.propTypes = {
  private: PropTypes.bool,
  handleChange: PropTypes.func,
};

export default TogglePrivacyBtn;
