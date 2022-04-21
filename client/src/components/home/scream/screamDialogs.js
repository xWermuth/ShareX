// import React, { Component, Fragment } from "react";
// import { Link } from "react-router-dom";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";

// // MUI
// import {
//   Card,
//   CardContent,
//   CardMedia,
//   withStyles,
//   Typography,
//   Grid,
//   CircularProgress,
//   Dialog,
//   DialogContent,
// } from "@material-ui/core";

// // Icons
// import ChatIcon from "@material-ui/icons/Chat";
// import { FavoriteBorder, UnfoldMore } from "@material-ui/icons";
// import FavoriteIcon from "@material-ui/icons/Favorite";
// import CloseIcon from "@material-ui/icons/Close";

// // Components
// import MyButton from "../../util/myButton";
// import LikeButton from "./likeButton";
// import Commments from "./comments";
// import CommentForm from "./commentForm";

// // Redux
// import { connect } from "react-redux";
// import { getScream, clearErrors } from "../../../redux/actions/dataActions";

// import PropTypes from "prop-types";

// const styles = (theme) => ({
//   ...theme.spreadThis,
// });

// class ScreamDialogs extends Component {
//   state = {
//     open: false,
//   };
//   handleOpen = () => {
//     this.setState({ open: true });
//   };
//   handleClose = () => {
//     this.setState({ open: false });
//   };
//   render() {
//       const {user: {}}
//     return (
//       <Fragment>
//         <MyButton tip="Add comment">
//           <ChatIcon color="primary" />
//         </MyButton>
//         <span style={{ margin: 0 }}>{commentCount} comments</span>
//       </Fragment>
//     );
//   }
// }

// ScreamDialogs.propTypes = {
//   user: PropTypes.object.isRequired,
//   scream: PropTypes.object.isRequired
// };

// const mapStateToProps = (state) => ({
//   user: state.user,
// });

// const mapActionsToProps = {};

// export default connect(
//   mapStateToProps,
//   mapActionsToProps
// )(withStyles(styles)(ScreamDialogs));
