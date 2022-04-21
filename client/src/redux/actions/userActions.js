import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  FOLLOW_USER,
  UNFOLLOW_USER,
  STOP_LOADING_UI,
  ADD_BOOKMARK,
  REMOVE_BOOKMARK,
  LOADING_BUTTON,
  STOP_LOADING_BUTTON,
  REMOVE_NOTIFICATION,
  CLEAR_NOTIFICATION_TO_DELETE,
} from "../types";
import axios from "axios";

export const loginUser = (user, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });

  axios
    .post(`${process.env.REACT_APP_PROXY}/auth/login`, {
      email: user.email,
      password: user.password,
    })
    .then((res) => {
      setAuthorizationHeader(res.data.token);

      dispatch(getUserData());

      dispatch({ type: CLEAR_ERRORS });

      history.push("/home/forYouPage");
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};
export const signUpUser = (newUser, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });

  axios
    .post(`${process.env.REACT_APP_PROXY}/auth/signup`, {
      email: newUser.email,
      handle: newUser.handle,
      password: newUser.password,
      privacy: newUser.privacy,
    })
    .then((res) => {
      setAuthorizationHeader(res.data);

      dispatch(getUserData());

      dispatch({ type: CLEAR_ERRORS });

      history.push("/home/Screams");
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("user_token");

  // console.log("AXIOS HEADER", axios.defaults.headers.common["Authorization"]);
  delete axios.defaults.headers.common["Authorization"];

  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });

  axios
    .get(`${process.env.REACT_APP_PROXY}/users/authUser`)
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const uploadProfileImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_UI });

  axios
    .post(`${process.env.REACT_APP_PROXY}/photos/profilePicture`, formData)
    .then((res) => {
      dispatch(getUserData());
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });

  axios
    .put(`${process.env.REACT_APP_PROXY}/users/userDetails`, {
      bio: userDetails.bio,
      website: userDetails.website,
      location: userDetails.location,
      privacy: userDetails.privacy,
    })
    .then((res) => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  // console.log("POSTING", notificationIds);
  axios
    .post(`${process.env.REACT_APP_PROXY}/notifications/readAllNotification`)
    .then((res) => {
      dispatch({ type: MARK_NOTIFICATIONS_READ });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: STOP_LOADING_BUTTON });
    });
};

export const followUser = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_BUTTON });
  axios
    .post(`${process.env.REACT_APP_PROXY}/users/followUser`, {
      following: userHandle,
    })
    .then((res) => {
      dispatch({ type: FOLLOW_USER, payload: res.data });
      dispatch({ type: STOP_LOADING_BUTTON });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: STOP_LOADING_BUTTON });
    });
};

export const unfollowUser = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_BUTTON });
  axios
    .delete(`${process.env.REACT_APP_PROXY}/users/unfollowUser/${userHandle}`)
    .then((res) => {
      dispatch({ type: UNFOLLOW_USER, payload: res.data });
      dispatch({ type: STOP_LOADING_BUTTON });
    })
    .catch((err) => {
      console.log(err.message);
      dispatch({ type: STOP_LOADING_BUTTON });
    });
};

export const bookmarkScreams = (screamId) => (dispatch) => {
  dispatch({ type: LOADING_BUTTON });

  axios
    .post(`${process.env.REACT_APP_PROXY}/users/bookmark/scream`, { screamId })
    .then((res) => {
      dispatch({ type: ADD_BOOKMARK, payload: res.data });
      dispatch({ type: STOP_LOADING_BUTTON });
    })
    .catch((err) => {
      console.log("Error bookmarking", err.message);
      dispatch({ type: STOP_LOADING_BUTTON });
    });
};

export const removeBookmark = (screamId) => (dispatch) => {
  dispatch({ type: LOADING_BUTTON });

  axios
    .delete(`${process.env.REACT_APP_PROXY}/users/bookmark/scream/${screamId}`)
    .then((res) => {
      dispatch({ type: REMOVE_BOOKMARK, payload: res.data });
      dispatch({ type: STOP_LOADING_BUTTON });
    })
    .catch((err) => {
      console.log(err.message);
      dispatch({ type: STOP_LOADING_BUTTON });
    });
};

export const grantFollowAccount = (notificationId, following) => (dispatch) => {
  dispatch({ type: LOADING_BUTTON });

  axios
    .post(`${process.env.REACT_APP_PROXY}/users/access`, {
      notificationId,
      following,
    })
    .then((response) => {
      dispatch({ type: REMOVE_NOTIFICATION, payload: notificationId });
      dispatch({ type: STOP_LOADING_BUTTON });
      console.log(response);
    })
    .catch((err) => {
      console.log(err.message);
      dispatch({ type: STOP_LOADING_BUTTON });
    });
};
export const denyFollowAccount = (notificationId) => (dispatch) => {
  dispatch({ type: LOADING_BUTTON });
  console.log("here", notificationId);

  axios
    .delete(`${process.env.REACT_APP_PROXY}/users/access/${notificationId}`)
    .then((res) => {
      dispatch({ type: FOLLOW_USER, payload: res.data });
      dispatch({ type: REMOVE_NOTIFICATION, payload: notificationId });
      dispatch({ type: STOP_LOADING_BUTTON });
    })
    .catch((err) => {
      console.log(err.message);
      dispatch({ type: STOP_LOADING_BUTTON });
    });
};

export const clear_notification_to_delete = () => (dispatch) =>
  dispatch({ type: CLEAR_NOTIFICATION_TO_DELETE });

const setAuthorizationHeader = (token) => {
  // const userToken = `Authorization ${token}`;
  localStorage.setItem("user_token", token);
  axios.defaults.headers.common["Authorization"] = token;
};
