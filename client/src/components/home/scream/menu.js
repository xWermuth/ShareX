import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

// Components
import MyButton from "../../util/myButton";
import DeleteScream from "./deleteScream";
import { StyledMenu, StyledMenuItem } from "../../util/menu/costumeMenuTabs";
import BookMarkButton from "./bookmarkButton";
import FollowButton from "./followButton";
// Redux
import { connect } from "react-redux";

// ICONS
import {
  MoreVert,
  PersonAdd as PersonAddIcon,
  UnfoldMore,
  Bookmark,
} from "@material-ui/icons";

const styles = {
  removePadding: { padding: "0 !important" },
};

const CustomMenu = React.forwardRef((props, ref) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { screamId, userHandle, authenticated, handle, classes } = props;
  const dynamicStyledMenuItem =
    authenticated && userHandle === handle ? (
      <DeleteScream screamId={screamId} />
    ) : (
      <FollowButton type="menu" handle={userHandle} ref={ref} />
    );

  const closeButton =
    props.closeButton === undefined ? null : (
      <StyledMenuItem onClick={props.closeButton}>
        <ListItemIcon>
          <MyButton tip="Close" btnClassName={classes.removePadding}>
            <CloseIcon color="secondary" />
          </MyButton>
        </ListItemIcon>
        <ListItemText primary="Close dialog" />
      </StyledMenuItem>
    );

  return (
    <div ref={ref}>
      <MyButton tip="more" onClick={handleClick}>
        <MoreVert />
      </MyButton>
      <StyledMenu
        id="costumized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        ref={ref}
      >
        {dynamicStyledMenuItem}
        {authenticated && <BookMarkButton isMenu={true} screamId={screamId} />}
        <StyledMenuItem>
          <ListItemIcon>
            <UnfoldMore fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View Scream" />
        </StyledMenuItem>
        {closeButton}
      </StyledMenu>
    </div>
  );
});

CustomMenu.propTypes = {
  authenticated: PropTypes.bool,
  handle: PropTypes.string,
  userHandle: PropTypes.string.isRequired,
  screamId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  closeButton: PropTypes.func,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  handle: state.user.userDetail.credentials.handle,
});

export default connect(mapStateToProps)(withStyles(styles)(CustomMenu));
