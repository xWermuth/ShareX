import {
  SET_SCREAMS,
  SET_SCREAM,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
  SET_SCREAMS_AND_PROFILE,
  LOADING_BUTTON,
  STOP_LOADING_BUTTON,
  ADD_SCREAMS,
  SET_PAGINATION,
  CLEAR_DATA_ERROR,
  GET_COMMENTS,
  INCREASE_COMMENT_PAGINATION,
  LOADING_PAGINATION,
  NOT_AUTHENTICATED,
  STOP_LOADING_DATA,
} from "../types";

import axios from "axios";

export const getAllScreams = (isScrolling) => (dispatch, getState) => {
  const { pagination } = getState().UI;

  if (!pagination.offset || pagination.offset === 0)
    dispatch({ type: LOADING_DATA });

  axios
    .get(`${process.env.REACT_APP_PROXY}/screams/allScreams`, {
      params: { offset: isScrolling ? pagination.offset : 0 },
    })
    .then((res) => {
      dispatch({
        type: isScrolling ? ADD_SCREAMS : SET_SCREAMS,
        payload: res.data.screams.docs,
      });
      delete res.data.screams.docs;
      dispatch({ type: SET_PAGINATION, payload: res.data.screams });
    })
    .catch((err) => {
      dispatch({ type: SET_SCREAMS, payload: [] });
    });
};

export const getScreamsFromFollowers = (isScrolling) => (
  dispatch,
  getState
) => {
  const { pagination } = getState().UI;

  if (pagination.offset === 0 || !pagination.offset)
    dispatch({ type: LOADING_DATA });

  axios
    .get(`${process.env.REACT_APP_PROXY}/screams/following`, {
      params: { offset: isScrolling ? pagination.offset : 0 },
    })
    .then((res) => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({
        type: isScrolling ? ADD_SCREAMS : SET_SCREAMS,
        payload: res.data.docs,
      });
      delete res.data.docs;
      dispatch({ type: SET_PAGINATION, payload: res.data });
    })
    .catch((err) => {
      console.log("error fetching screams", err);
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const getComments = (screamId) => (dispatch, getState) => {
  dispatch({ type: INCREASE_COMMENT_PAGINATION });

  const { commentPagination } = getState().data.scream;

  if (commentPagination.offset === 0 || !commentPagination.offset)
    dispatch({ type: LOADING_DATA });

  dispatch({ type: LOADING_PAGINATION });
  axios
    .get(`${process.env.REACT_APP_PROXY}/comments/${screamId}`, {
      params: { offset: commentPagination.offset },
    })
    .then((response) => {
      console.log("---res", response.data);
      dispatch({ type: GET_COMMENTS, payload: response.data });
      dispatch({ type: INCREASE_COMMENT_PAGINATION });
    })
    .catch((error) => console.log(error.message));
};

export const getScream = (screamId) => (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_PROXY}/screams/${screamId}`)
    .then((res) => {
      dispatch({ type: SET_SCREAM, payload: res.data });

      dispatch({ type: INCREASE_COMMENT_PAGINATION });

      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((error) => console.log(error));
};

export const likeUnlikeScreams = (screamId) => (dispatch) => {
  dispatch({ type: LOADING_BUTTON });
  axios
    .post(`${process.env.REACT_APP_PROXY}/likes/scream/${screamId}`)
    .then((res) => {
      const type = res.data.reducer === "like" ? LIKE_SCREAM : UNLIKE_SCREAM;

      dispatch({ type, payload: res.data });
      dispatch({ type: STOP_LOADING_BUTTON });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const submitComment = (screamId, commentData) => (dispatch) => {
  axios
    .post(`${process.env.REACT_APP_PROXY}/comments/`, {
      body: commentData.body,
      screamId,
    })
    .then((res) => {
      dispatch({ type: SUBMIT_COMMENT, payload: res.data });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response });
      console.log(err);
    });
};

export const deleteScream = (screamId) => (dispatch) => {
  axios
    .delete(`${process.env.REACT_APP_PROXY}/screams/${screamId}`)
    .then((res) => {
      dispatch({ type: DELETE_SCREAM, payload: screamId });
    })
    .catch((err) => console.log(err));
};

export const postScream = (body) => (dispatch) => {
  dispatch({ type: LOADING_UI });

  axios
    .post(`${process.env.REACT_APP_PROXY}/screams/`, body)
    .then((res) => {
      dispatch({ type: POST_SCREAM, payload: res.data });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const getUserProfile = (userHandle) => (dispatch, getState) => {
  dispatch({ type: LOADING_DATA });

  const authUser = getState().user.userDetail.credentials.handle;
  const isAuthenticated = getState().user.authenticated;

  axios
    .get(
      `${process.env.REACT_APP_PROXY}/users/${
        isAuthenticated ? "auth/" : ""
      }${userHandle}`,
      {
        params: { requester: authUser },
      }
    )
    .then((res) => {
      dispatch({
        type: SET_SCREAMS_AND_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response.data.userDetails) {
        dispatch({
          type: NOT_AUTHENTICATED,
          payload: err.response.data,
        });
      } else {
        console.log("Error occured: ", err.response.data);
      }
      dispatch({ type: STOP_LOADING_DATA });
    });
};

export const postScreamWithData = (body, file) => (dispatch) => {
  dispatch({ type: LOADING_UI });

  var formData = new FormData();

  formData.append("body", body);
  formData.append("image", file, file.name);

  axios
    .post(`${process.env.REACT_APP_PROXY}/screams/post`, formData)
    .then((res) => {
      dispatch({ type: POST_SCREAM, payload: res.data });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const setLoading = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
