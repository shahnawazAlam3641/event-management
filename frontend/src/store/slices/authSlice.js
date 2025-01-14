import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("auth_token")?.replace(/^"|"$/g, "") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser(state, action) {
      state.user = action.payload;
    },
    login(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      // Persist to localStorage
      localStorage.setItem("auth_token", JSON.stringify(token));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      // Remove from localStorage
      localStorage.removeItem("auth_token");
    },
  },
});

export const { login, logout, addUser } = authSlice.actions;
export default authSlice.reducer;
