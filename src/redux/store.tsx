import { configureStore, createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    settings: { chosen: 0 },
  },
  reducers: {
    setSettings: (state, action) => {
      const newValue = action.payload;
      state.settings = newValue;
    },
  },
});

export const store = configureStore({ reducer: { app: appSlice.reducer } });

export const { setSettings } = appSlice.actions;
