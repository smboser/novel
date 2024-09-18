import { SET_USER_DETAILS } from '../actions/userActions';

const initialState = {
  users: null,
};

// User details Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        users: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
