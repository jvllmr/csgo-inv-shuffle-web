import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { RootState } from "../redux";

interface InitialState {
  authenticated: boolean;
  steamid64: string | null;
}

const initialState: InitialState = { authenticated: false, steamid64: null };

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload;
    },

    setAuthID: (state, action: PayloadAction<string | null>) => {
      state.steamid64 = action.payload;
    },
    removeAuth: (state) => {
      state.steamid64 = null;
      state.authenticated = false;
    },
  },
});

export const { setAuthID, setAuthenticated, removeAuth } = authSlice.actions;

export const authPersistConfig: PersistConfig<InitialState> = {
  key: "auth",
  storage: storage,
};

export const selectAuthenticated = (state: RootState) =>
  state.auth.authenticated;
export const selectSteamID = (state: RootState) => state.auth.steamid64;
export default authSlice.reducer;
