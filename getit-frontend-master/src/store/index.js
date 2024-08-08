import { applyMiddleware, compose, createStore } from "redux";

import { persistStore, persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage";
import rootReducer from "../reducers/index";

import thunkMiddleware from "redux-thunk";
import thunk from "redux-thunk";

import { configureStore, createListenerMiddleware, getDefaultMiddleware } from "@reduxjs/toolkit";

// import logger from "redux-logger";
const persistConfig = {
  key: "persist-root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: true,
});

const persistor = persistStore(store);

export default store;

export { persistor };
