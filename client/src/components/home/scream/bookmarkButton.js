import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import {
  bookmarkScreams,
  removeBookmark,
} from "../../../redux/actions/userActions";

// Mui

import { ListItemIcon, ListItemText } from "@material-ui/core";

// Components
import MyButton from "../../util/myButton";
import { StyledMenu, StyledMenuItem } from "../../util/menu/costumeMenuTabs";

// Logo
import { Bookmark, BookmarkBorder } from "@material-ui/icons";

class BookMarkButton extends Component {
  state = { isBookmarked: false };
  isBookMarked() {
    const bookmarks = this.props.bookmarks;
    const screamId = this.props.screamId;

    if (
      bookmarks &&
      bookmarks.find((bookmark) => bookmark.screamId === screamId)
    ) {
      return true;
    } else {
      return false;
    }
  }

  bookmarkScream = () => {
    this.props.bookmarkScreams(this.props.screamId);
  };

  removeBookmark = () => {
    this.props.removeBookmark(this.props.screamId);
  };

  render() {
    const { isMenu, loading } = this.props;
    const isBookmarked = this.isBookMarked();

    const button = isMenu ? (
      <StyledMenuItem
        onClick={isBookmarked ? this.removeBookmark : this.bookmarkScream}
        disabled={loading}
      >
        <ListItemIcon>
          {isBookmarked ? (
            <Bookmark fontSize="small" />
          ) : (
            <BookmarkBorder fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={isBookmarked ? "Unsave Scream" : "Save scream"}
        />
      </StyledMenuItem>
    ) : (
      <MyButton
        onClick={isBookmarked ? this.removeBookmark : this.bookmarkScream}
        tip={isBookmarked ? "Remove bookmark" : "Bookmark Scream"}
        tipClassName={this.props.className}
        disabled={loading}
      >
        {isBookmarked ? (
          <Bookmark color="primary" />
        ) : (
          <BookmarkBorder color="primary" />
        )}
      </MyButton>
    );
    return <Fragment> {button}</Fragment>;
  }
}

BookMarkButton.propTypes = {
  isMenu: PropTypes.bool.isRequired,
  bookmarks: PropTypes.array.isRequired,
  bookmarkScreams: PropTypes.func.isRequired,
  removeBookmark: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  loading: state.data.loading_button,
  bookmarks: state.user.bookmarks,
});

const mapActionsToProps = {
  bookmarkScreams,
  removeBookmark,
};

export default connect(mapStateToProps, mapActionsToProps)(BookMarkButton);
