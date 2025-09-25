import { configureStore, createSlice } from "@reduxjs/toolkit";

const settings = {
  chosen: 0,
};

const dashboard = {};

const users = {
  total: 0,
  page: 1,
  busy: true,
  data: [],
};

const appSlice = createSlice({
  name: "app",
  initialState: {
    settings: { ...settings },
  },
  reducers: {
    setSettings: (state, action) => {
      const newValue = action.payload;
      state.settings = newValue;
    },
  },
});

const dataSlice = createSlice({
  name: "data",
  initialState: {
    dashboard: { ...dashboard },
    users: { ...users },
  },
  reducers: {
    setDashboard: (state, action) => {
      const newValue = action.payload;
      state.dashboard = newValue;
    },
    setUsers: (state, action) => {
      const newValue = action.payload;
      state.users = newValue;
    },
  },
});

export const store = configureStore({
  reducer: { app: appSlice.reducer, data: dataSlice.reducer },
});

export const { setSettings } = appSlice.actions;

export const { setDashboard, setUsers } = dataSlice.actions;

export const clearAllRedux = () => {
  store.dispatch(setSettings({ ...settings }));
  store.dispatch(setDashboard({ ...dashboard }));
  store.dispatch(setUsers({ ...users }));
};
