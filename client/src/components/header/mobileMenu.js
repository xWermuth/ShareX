import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Redux
import { connect } from "react-redux";

// MUI
import { Menu, MenuItem, Typography, withStyles } from "@material-ui/core";

// Components
import Notification from "./notifications";
import MyButton from "../util/myButton";
import PostScream from "../home/scream/postScreamDialog";
import Logout from "../util/logout";

// Icons
import { AccountBox, MoreVert } from "@material-ui/icons";

// Style
const styles = (theme) => ({
  menuRoot: {
    top: 64,
    "& .MuiPaper-root": { top: "64px !important", backgroundColor: "#bac5d1" },
  },
  menuToggle: {
    display: "flex",
    [theme.breakpoints.up("md")]: { display: "none" },
  },
});

const MobileMenu = (props) => {
  const { classes, userHandle } = props;
  const [mobileAnchorEle, setMobileAnchorEle] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileAnchorEle);

  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEle(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEle(null);
  };

  return (
    <Fragment>
      <MyButton
        tip="Expand menu"
        onClick={handleMobileMenuOpen}
        tipClassName={classes.menuToggle}
      >
        <MoreVert color="primary" />
      </MyButton>
      <Menu
        className={classes.menuRoot}
        anchorEl={mobileAnchorEle}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id="mobileMenu"
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <PostScream type="icon" />
          <Typography variant="body2">Post Scream!</Typography>
        </MenuItem>

        <MenuItem>
          <Link to={`/users/${userHandle}`}>
            <MyButton tip="Your Profile">
              <AccountBox color="inherit" />
            </MyButton>
          </Link>
          <Typography variant="body2">Your Profile</Typography>
        </MenuItem>

        <MenuItem>
          <Notification />
          <Typography variant="body2">Notifications</Typography>
        </MenuItem>
        <MenuItem>
          <Logout />
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

MobileMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  userHandle: PropTypes.string,
};

const mapStateToProps = (state) => ({
  userHandle: state.user.userDetail.credentials.handle,
});

export default connect(mapStateToProps)(withStyles(styles)(MobileMenu));
