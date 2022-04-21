import React, { Fragment } from "react";
import PropTypes from "prop-types";

// MUI
import { Grid, withStyles, Tabs, Tab } from "@material-ui/core";

// Redux
import { connect } from "react-redux";

// Components
import StaticScream from "../home/scream/staticScreams";
import ScreamSkelton from "./screamSkeleton";

const ProfileScreams = (props) => {
  const { screams, loading, value, classes, screamIdParam } = props;

  const screamsMarkup = loading ? (
    <ScreamSkelton />
  ) : screams === null ? (
    <p>No screams from this user</p>
  ) : !screamIdParam ? (
    <div className={classes.root}>
      <Grid container className={classes.gridList}>
        {screams.map((scream) => (
          <Fragment key={scream._id}>
            {value === 0 && (
              <StaticScream
                key={scream._id}
                screamId={scream._id}
                url={scream.postContent.url}
                userHandle={scream.userHandle}
              />
            )}
            {value === 1 && (
              <StaticScream
                key={screams.screamId}
                screamId={scream.screamId}
                url={scream.url}
                userHandle={scream.screamHandle}
              />
            )}
          </Fragment>
        ))}
      </Grid>
    </div>
  ) : (
    <div className={classes.root}>
      <Grid container xs={12} sm={12} className={classes.gridList}>
        {screams.map((scream) => {
          if (scream._id !== screamIdParam)
            return (
              <Fragment key={scream._id}>
                {value === 0 && (
                  <StaticScream
                    key={scream._id + scream.userHandle}
                    screamId={scream._id}
                    url={scream.postContent.url}
                    userHandle={scream.userHandle}
                  />
                )}
                {value === 1 && (
                  <StaticScream
                    key={scream.screamId + scream.screamHandle}
                    screamId={scream.screamId}
                    url={scream.url}
                    userHandle={scream.screamHandle}
                  />
                )}
              </Fragment>
            );
          else {
            return (
              <Fragment key={scream._id}>
                {value === 0 && (
                  <StaticScream
                    key={scream._id}
                    screamId={scream._id}
                    url={scream.postContent.url}
                    userHandle={scream.userHandle}
                    openDialog
                  />
                )}
                {value === 1 && (
                  <StaticScream
                    key={scream.screamId}
                    screamId={scream.screamId + scream.screamHandle}
                    url={scream.url}
                    userHandle={scream.screamHandle}
                    openDialog
                  />
                )}
              </Fragment>
            );
          }
        })}
      </Grid>
    </div>
  );

  return <Fragment>{screamsMarkup}</Fragment>;
};

ProfileScreams.propTypes = {
  screams: PropTypes.array,
  loading: PropTypes.bool,
  value: PropTypes.number,
  classes: PropTypes.object,
  screamIdParam: PropTypes.string,
};

const mapStateToProps = (state) => ({
  loading: state.data.loading,
});

export default connect(mapStateToProps)(ProfileScreams);
