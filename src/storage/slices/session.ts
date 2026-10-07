import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Family, User } from "../../types/apiTypes";

interface SessionState {
  createdAt?: string;
  accessToken?: string;
  user?: User;
  selectedFamily?: Family;
}

const initialState: SessionState = {};

type SessionPayload = PayloadAction<{
  user: User;
  // Only for password sign-in; Auth0 tokens stay in the SDK's memory
  accessToken?: string;
  family?: Family;
}>;
type SelectedFamilyPayload = PayloadAction<{ family: Family }>;

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (_state, { payload }: SessionPayload) => {
      return {
        createdAt: new Date().toISOString(),
        accessToken: payload.accessToken,
        user: payload.user,
        selectedFamily: payload.family,
      };
    },
    setSelectedFamily: (state, { payload }: SelectedFamilyPayload) => {
      return { ...state, selectedFamily: payload.family };
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

export const { setSession, unsetSession, setSelectedFamily, updateTokens } =
  sessionSlice.actions;
export const { reducer: sessionReducer } = sessionSlice;
