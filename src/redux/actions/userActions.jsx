// Action Types
export const SET_USER_DETAILS = 'SET_USER_DETAILS';

// Action Creator
export const setUserDetails = (data) => ({
  type: SET_USER_DETAILS,
  payload: data,
});
