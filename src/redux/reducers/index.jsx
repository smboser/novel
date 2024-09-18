import { combineReducers } from 'redux';
import userReducer from './userReducer';

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
