import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/apiTypes";

interface SessionState {
  createdAt?: string;
  accessToken?: string;
  user?: User;
}

const initialState: SessionState = {};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (
      _state,
      {
        payload,
      }: PayloadAction<{
        user: User;
        accessToken: string;
      }>
    ) => {
      return {
        createdAt: new Date().toISOString(),
        accessToken: payload.accessToken,
        user: payload.user,
      };
    },
    updateTokens: (
      state,
      { payload }: PayloadAction<{ accessToken: string }>
    ) => {
      return {
        ...state,
        accessToken: payload.accessToken,
      };
    },
    unsetSession: () => {
      return initialState;
    },
    updateAccessToken: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      accessToken: payload,
    }),
  },
});

export const { setSession, unsetSession, updateTokens } = sessionSlice.actions;
export const { reducer: sessionReducer } = sessionSlice;
