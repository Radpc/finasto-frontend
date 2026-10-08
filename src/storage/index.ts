import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { sessionReducer, unsetSession, updateTokens } from "./slices/session";

import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "financeio",
  version: 1,
  storage,
};

const combinedReducers = combineReducers({
  session: sessionReducer,
});

const persistedReducer = persistReducer(persistConfig, combinedReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Common getters
export const getAccessToken = () => store.getState().session.accessToken;
export const getSelectedFamilyId = () =>
  store.getState().session.selectedFamily?.id;
export const setTokens = (accessToken: string) =>
  store.dispatch(updateTokens({ accessToken }));
export const externalUnsetSession = () => store.dispatch(unsetSession());
