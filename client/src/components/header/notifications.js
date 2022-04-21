//MUI framework
import { Badge, IconButton, Tooltip, withStyles } from "@material-ui/core";
// Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
// axios
import axios from "axios";
// dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
// Redux
import { connect } from "react-redux";
import { increaseOffset, resetPagination } from "../../redux/actions/uiActions";
import {
  grantFollowAccount,
  markNotificationsRead,
} from "../../redux/actions/userActions";
import NotificationItem from "./notificationItem";

const styles = (theme) => ({
  ...theme.fonts,
  menuRoot: {
    maxHeight: 500,
  },
});

const Notifications = (props) => {
  const [anchorElState, setAnchorEl] = useState(null);
  const [offsetState, setOffset] = useState(0);
  const [notificationsState, setNotifications] = useState([]);
  const [hasMoreState, setHasMore] = useState(true);
  const [isFetchingState, setIsFetching] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_PROXY}/notifications/getNotification`, {
        params: { offset: offsetState },
      })
      .then((res) => {
        const offset = res.data.paginate_options.offset;
        const limit = res.data.paginate_options.limit;
        const hasMore = res.data.paginate_options.hasNextPage;
        const notifications = res.data.notifications;
        setHasMore(hasMore);
        setOffset(offset + limit);
        setNotifications(notifications);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    setNotifications(props.notifications);
  }, [props.notifications]);

  const handleOpen = (event) => {
    setAnchorEl(event.target);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onMenuExited = () => {
    if (
      notificationsState.length < 1 ||
      notificationsState[0] === "You have no notifications"
    ) {
      return;
    }

    let unReadNotificationsId = notificationsState
      .filter((notification) => !notification.read)
      .map((notification) => notification.id);

    props.markNotificationsRead(unReadNotificationsId);
  };
  const handleScroll = (event) => {
    console.log("called");
    const height = event.target.clientHeight;
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;

    if (
      scrollTop + height !== scrollHeight ||
      isFetchingState ||
      !hasMoreState
    ) {
      return;
    }
    if (offsetState === 0) return;
    fetchMoreData();
  };
  const fetchMoreData = () => {
    setIsFetching(true);
    axios
      .get(`${process.env.REACT_APP_PROXY}/notifications/getNotification`, {
        params: { offset: offsetState },
      })
      .then((res) => {
        const offset = res.data.paginate_options.offset;
        const limit = res.data.paginate_options.limit;
        const hasMore = res.data.paginate_options.hasNextPage;
        const notifications = res.data.notifications;

        setHasMore(hasMore);
        setOffset(offset + limit);
        setNotifications([...notificationsState, ...notifications]);
        setIsFetching(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const { classes, notificationsAmount } = props;

  // const notificationsAmount = notifications.length;

  dayjs.extend(relativeTime);

  let notificationsIcon =
    notificationsAmount > 0 ? (
      <Badge badgeContent={notificationsAmount} color="secondary">
        <NotificationsIcon color="inherit" />
      </Badge>
    ) : (
      <NotificationsIcon color="inherit" />
    );

  let notificationsMarkup = (
    <NotificationItem
      notificationsState={notificationsState}
      handleClose={handleClose}
      handleOpen={handleOpen}
      hasMoreState={hasMoreState}
      isFetchingState={isFetchingState}
      anchorElState={anchorElState}
      onMenuExited={onMenuExited}
      handleScroll={handleScroll}
    />
  );
  return (
    <Fragment>
      <Tooltip placement="top" title="Notifications">
        <IconButton
          area-owns={anchorElState ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          {notificationsIcon}
        </IconButton>
      </Tooltip>

      {notificationsMarkup}
    </Fragment>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.array,
  notificationsAmount: PropTypes.number,
  classes: PropTypes.object,
  hasMore: PropTypes.bool,
  markNotificationsRead: PropTypes.func,
  resetPagination: PropTypes.func,
  increaseOffset: PropTypes.func,
  grantFollowAccount: PropTypes.func,
  denyFollowAccount: PropTypes.func,
};

const mapStateToProps = (state) => ({
  notifications: state.user.notifications,
  notificationsAmount: state.user.numberOfUnreadNotifications,
  hasMore: state.UI.pagination.hasNextPage,
});

const mapActionsToProps = {
  increaseOffset,
  resetPagination,
  markNotificationsRead,
  grantFollowAccount,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Notifications));
