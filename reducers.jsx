import { SET_USER_NAME } from './actions';

const initialState = {
  users: null,
};

// Reducer
const rootReducer = (state = initialState, action) => {
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

export default rootReducer;
