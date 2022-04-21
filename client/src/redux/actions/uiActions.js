import {
  SET_HOME_PAGE,
  SET_SEARCH_NAVBAR,
  INCREASE_OFFSET,
  RESET_PAGINATION,
} from "../types";

export const setHomePage = (isHomePage) => (dispatch) => {
  dispatch({ type: SET_HOME_PAGE, payload: isHomePage });
};

export const setSearchPage = (isSearchNavbar) => (dispatch) => {
  dispatch({ type: SET_SEARCH_NAVBAR, payload: isSearchNavbar });
};

export const increaseOffset = () => (dispatch) => {
  dispatch({ type: INCREASE_OFFSET });
};

export const resetPagination = () => (dispatch) => {
  dispatch({ type: RESET_PAGINATION });
};
