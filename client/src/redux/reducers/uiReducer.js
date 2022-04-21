import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  SET_HOME_PAGE,
  SET_SEARCH_NAVBAR,
  SET_PAGINATION,
  RESET_PAGINATION,
  INCREASE_OFFSET,
} from "../types";

const initialState = {
  loading: false,
  errors: null,
  isHomePage: false,
  isSearchNavbar: false,
  pagination: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null,
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING_UI:
      return {
        ...state,
        loading: false,
      };
    case SET_HOME_PAGE:
      return { ...state, isHomePage: action.payload };

    case SET_SEARCH_NAVBAR:
      return { ...state, isSearchNavbar: action.payload };

    case SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    case RESET_PAGINATION:
      return {
        ...state,
        pagination: {},
      };

    case INCREASE_OFFSET:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          offset: state.pagination.offset + state.pagination.limit,
        },
      };

    default:
      return state;
  }
}
