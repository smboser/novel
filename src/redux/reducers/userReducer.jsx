import { SET_USER_NAME } from '../actions/userActions';

const initialState = {
  users: null,
};

// User Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_NAME:
      return {
        ...state,
        users: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
