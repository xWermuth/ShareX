import {
  SET_SCREAMS,
  SET_SCREAM,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_DATA,
  DELETE_SCREAM,
  POST_SCREAM,
  SUBMIT_COMMENT,
  SET_SCREAMS_AND_PROFILE,
  FOLLOW_USER,
  UNFOLLOW_USER,
  LOADING_BUTTON,
  STOP_LOADING_BUTTON,
  ADD_SCREAMS,
  GET_COMMENTS,
  INCREASE_COMMENT_PAGINATION,
  LOADING_PAGINATION,
  NOT_AUTHENTICATED,
  CLEAR_DATA_ERROR,
  SET_ERRORS,
} from "../types";

const initialState = {
  screams: [],
  scream: {
    comments: [],
    postContent: {},
    commentPagination: {},
    loading: false,
  },
  loading: false,
  loading_button: false,
  authorized: true,
  isRequestingFollow: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return { ...state, loading: true };

    case LOADING_PAGINATION:
      return { ...state, scream: { ...state.scream, loading: true } };

    case LOADING_BUTTON:
      return { ...state, loading_button: true };

    case STOP_LOADING_BUTTON:
      return { ...state, loading_button: false };

    case SET_ERRORS:
      return { ...state, loading: false };

    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false,
      };

    case ADD_SCREAMS:
      return {
        ...state,
        screams: [...state.screams, ...action.payload],
        loading: false,
      };

    case SET_SCREAMS_AND_PROFILE:
      return {
        ...state,
        screams: action.payload.screams,
        profile: action.payload.userDetails.credentials,
        loading: false,
        isRequestingFollow: false,
        authorized: true,
      };

    case SET_SCREAM:
      const comments = action.payload.comments.docs;
      delete action.payload.comments.docs;
      const pagination = action.payload.comments;
      return {
        ...state,
        scream: {
          ...state.scream,
          comments,
          ...action.payload.scream,
          commentPagination: { ...pagination },
        },
        loading: false,
      };

    case GET_COMMENTS:
      const newComments = action.payload.docs;
      console.log("NEW COMMENTS", newComments);
      delete action.payload.docs;
      const newPagination = action.payload;
      return {
        ...state,
        scream: {
          ...state.scream,
          comments: [...state.scream.comments, ...newComments],
          commentPagination: { ...newPagination },
          loading: false,
        },
      };

    case INCREASE_COMMENT_PAGINATION:
      return {
        ...state,
        scream: {
          ...state.scream,
          commentPagination: {
            ...state.scream.commentPagination,
            offset:
              state.scream.commentPagination.offset +
              state.scream.commentPagination.limit,
          },
        },
      };

    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let index = state.screams.findIndex(
        (scream) => scream._id === action.payload.scream._id
      );

      if (index === -1) {
        return { ...state };
      }

      state.screams[index] = action.payload.scream;

      if (state.scream._id === action.payload.scream._id) {
        return {
          ...state,
          scream: {
            ...state.scream,
            comments: state.scream.comments,
            ...action.payload.scream,
          },
        };
      }

      return { ...state };

    case DELETE_SCREAM:
      let indexOf = state.screams.findIndex(
        (scream) => scream._id === action.payload
      );

      state.screams.splice(indexOf, 1);

      return { ...state };

    case POST_SCREAM:
      return { ...state, screams: [action.payload, ...state.screams] };

    case SUBMIT_COMMENT:
      let indexAf = state.screams.findIndex(
        (scream) => scream._id === action.payload.scream._id
      );

      if (indexAf === -1) {
        return { ...state };
      }

      state.screams[indexAf] = action.payload.scream;

      return {
        ...state,
        scream: {
          ...state.scream,
          ...action.payload.scream,
          comments: [action.payload.comment, ...state.scream.comments],
        },
      };
    case FOLLOW_USER:
    case UNFOLLOW_USER:
      return {
        ...state,
        profile: {
          ...state.profile,
          followingCount: action.payload.followedUserFollowingCount,
          followersCount: action.payload.followedUserFollowersCount,
        },
        isRequestingFollow: action.payload.isRequestingFollow,
      };

    case NOT_AUTHENTICATED:
      const _profile = action.payload.userDetails.credentials;
      const _isRequestingFollow = action.payload.isRequesting || false;
      return {
        ...state,
        authorized: false,
        profile: _profile,
        isRequestingFollow: _isRequestingFollow,
        loading: false,
      };

    case CLEAR_DATA_ERROR:
      return {
        ...state,
        authorized: true,
        isRequesting: false,
        loading: false,
      };

    default:
      return state;
  }
}
