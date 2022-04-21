import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

// Components
import MyButton from "../../util/myButton";

// Icon
import FavoriteIcon from "@material-ui/icons/Favorite";
import { FavoriteBorder } from "@material-ui/icons";

// redux
import { connect } from "react-redux";
import { likeUnlikeScreams } from "../../../redux/actions/dataActions";

import PropTypes from "prop-types";

class LikeButton extends Component {
  isLikedScream = () => {
    const likes = this.props.user.userDetail.credentials.likes;
    if (likes && likes.find((like) => like.screamId === this.props.screamId)) {
      return true;
    } else {
      return false;
    }
  };

  likeScream = () => {
    const id = this.props.screamId;

    this.props.likeUnlikeScreams(id);
  };

  unlikeScream = () => {
    this.props.likeUnlikeScreams(this.props.screamId);
  };
  render() {
    const {
      user: { authenticated },
      loading,
    } = this.props;

    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.isLikedScream() ? (
      <MyButton tip="Unlike" onClick={this.unlikeScream} disabled={loading}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeScream} disabled={loading}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );

    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string,
  likeUnlikeScreams: PropTypes.func,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  loading: state.data.loading_button,
});

const mapActionsToProps = {
  likeUnlikeScreams,
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
