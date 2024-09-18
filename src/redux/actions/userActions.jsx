// Action Types
export const SET_USER_NAME = 'SET_USER_NAME';

// Action Creator
export const setUserDetails = (data) => ({
  type: SET_USER_NAME,
  payload: data,
});
