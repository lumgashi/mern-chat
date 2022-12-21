import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import appAPi from "./services/appApi";

//persist the store
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

//reducers
const reducers = combineReducers({
  user: userSlice,
  [appAPi.reducerPath]: appAPi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  blackList: [appAPi.reducerPath],
};

//persist our store
const persistedReducer = persistReducer(persistConfig, reducers);

//create the store

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, appAPi.middleware],
});

export default store;
