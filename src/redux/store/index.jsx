// import { createStore } from 'redux';
// import rootReducer from '../reducers';

// const store = createStore(rootReducer);

// export default store;

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import rootReducer from '../reducers'; // Adjust the path

const rootReducer = combineReducers({
  user: rootReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

