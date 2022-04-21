import React from "react";
import PropTypes from "prop-types";
import { Tooltip, IconButton } from "@material-ui/core";

export default ({
  children,
  onClick,
  tip,
  btnClassName,
  tipClassName,
  disabled,
  color,
  edge,
  size,
}) => (
  <Tooltip title={tip} className={tipClassName} placement="top">
    <span>
      <IconButton
        onClick={onClick}
        className={btnClassName}
        disabled={disabled}
        color={color ? color : "inherit"}
        edge={edge ? edge : false}
        size={size ? size : "medium"}
      >
        {children}
      </IconButton>
    </span>
  </Tooltip>
);

// @ts-ignore
Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  tip: PropTypes.string,
  btnClassName: PropTypes.string,
  tipClassName: PropTypes.string,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  edge: PropTypes.string,
  size: PropTypes.string,
};
