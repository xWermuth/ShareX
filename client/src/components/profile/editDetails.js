import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// MUI
import {
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";

//icons
import { LocationOn, CalendarToday, KeyboardReturn } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import LinkIcon from "@material-ui/icons/Link";

// Redux
import { connect } from "react-redux";
import { editUserDetails } from "../../redux/actions/userActions";

// Components
import MyButton from "../util/myButton";
import TogglePrivacyBtn from "../auth/togglePrivacy";

const styles = (theme) => ({
  ...theme.spreadThis,
  button: { float: "right" },
  editBtn: {
    fontWeight: 700,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: "x- small",
  },
});

class editDetails extends Component {
  state = {
    bio: "",
    website: "",
    location: "",
    private: false,
    open: false,
  };

  mapUserDetailsToState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      location: credentials.location ? credentials.location : "",
      privacy: credentials.privacy ? credentials.privacy : false,
    });
  };

  componentDidMount() {
    const { credentials } = this.props;
    this.mapUserDetailsToState(credentials);
  }

  handleOpen = () => {
    const { credentials } = this.props;
    this.mapUserDetailsToState(credentials);
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = () => {
    const userInfo = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location,
      privacy: this.state.private,
    };
    this.props.editUserDetails(userInfo);
    this.handleClose();
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Button
          variant="outlined"
          color="inherit"
          className={classes.editBtn}
          onClick={this.handleOpen}
        >
          Edit Profile
        </Button>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                rows="3"
                placeholder="A short bio about yourself"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />

              <TextField
                name="website"
                type="text"
                label="Website"
                placeholder="Link your website"
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />

              <TextField
                name="location"
                type="text"
                label="Location"
                placeholder="Where you live"
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />

              <div style={{ paddingTop: 10 }}>
                <TogglePrivacyBtn
                  privacy={this.state.private}
                  handleChange={(privacy) =>
                    this.setState({ private: privacy })
                  }
                />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

editDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  credentials: state.user.userDetail.credentials.userInfo,
});

export default connect(mapStateToProps, { editUserDetails })(
  withStyles(styles)(editDetails)
);
