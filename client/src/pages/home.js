import React, { Component, Fragment } from "react";

// Components
import Scream from "../components/home/scream/scream";
import PostScream from "../components/home/scream/postScream";
import Profile from "../components/profile/profile";
import ScreamSkelton from "../components/util/screamSkeleton";

// material UI
import { Grid, CircularProgress } from "@material-ui/core";

// css
import "../style/home.css";

import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import {
  getAllScreams,
  getScreamsFromFollowers,
} from "../redux/actions/dataActions";

import { increaseOffset } from "../redux/actions/uiActions.js";

import { setHomePage } from "../redux/actions/uiActions";

// Infinite scroll
import InfiniteScroll from "react-infinite-scroll-component";

class home extends Component {
  componentDidMount() {
    const page = this.props.match.params.page;

    const isScrolling = false;

    if (!this.props.authenticated) {
      this.props.getAllScreams();
    } else {
      page === "following"
        ? this.props.getScreamsFromFollowers(isScrolling)
        : this.props.getAllScreams(isScrolling);
    }

    let isHomePage = true;
    this.props.setHomePage(isHomePage);
  }

  fetchMoreData = () => {
    const page = this.props.match.params.page;

    const isScrolling = true;

    this.props.increaseOffset();

    page !== "following"
      ? this.props.getAllScreams(isScrolling)
      : this.props.getScreamsFromFollowers(isScrolling);
  };

  render() {
    const { screams, loading } = this.props.data;
    const { errors, hasMore } = this.props;
    const page = this.props.match.params.page;

    if (errors && page === "following") {
      return (
        <Fragment>
          <h3 style={{ paddingTop: 80, textAlign: "center" }}>
            {errors.error}
          </h3>
        </Fragment>
      );
    }

    let recentPost = !loading ? (
      screams.map((scream) => <Scream key={scream._id} scream={scream} />)
    ) : (
      <ScreamSkelton />
    );

    return (
      <Grid
        container
        spacing={6}
        justifycontent="center"
        align="center"
        style={{ paddingTop: 80 }}
      >
        <Grid item xs={12}>
          <PostScream />
          <InfiniteScroll
            dataLength={screams.length}
            next={this.fetchMoreData}
            hasMore={hasMore}
            loader={
              <CircularProgress
                style={{ paddingTop: 10 }}
                size={40}
                color="primary"
              />
            }
          >
            {recentPost}
          </InfiniteScroll>
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getAllScreams: PropTypes.func.isRequired,
  setHomePage: PropTypes.func.isRequired,
  getScreamsFromFollowers: PropTypes.func.isRequired,
  increaseOffset: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  errors: PropTypes.object,
};

const mapStateToProps = (state) => ({
  data: state.data,
  authenticated: state.user.authenticated,
  hasMore: state.UI.pagination.hasNextPage,
  errors: state.UI.errors,
});

const mapActionsToProps = {
  getAllScreams,
  setHomePage,
  getScreamsFromFollowers,
  increaseOffset,
};

export default connect(mapStateToProps, mapActionsToProps)(home);
