import { configureStore, createSlice } from "@reduxjs/toolkit";

const defaultUser = {
  roles: ["CLOUD_CURIOUS"], // Set default role
  favorites: [], // Set default favorites
};

const userSlice = createSlice({
  name: "user",
  initialState: defaultUser,
  reducers: {
    setUser: (state, action) => {
      state.roles = [...action.payload.roles, "CLOUD_CURIOUS"];
      state.favorites = action.payload.favorites || [];
      state.id = action.payload.userId;
    },
    removeUser: () => defaultUser,
    updateUserRoles: (state, action) => {
      state.roles = action.payload;
    },
    setFavorites: (state, action) => {
      state.favorites = Array.isArray(action.payload) ? action.payload : [];
      console.log(`Favorites set to: ${JSON.stringify(state.favorites)}`);
    },

    addToFavorites: (state, action) => {
      state.favorites.push(action.payload);
      console.log(`Added to favorites: ${action.payload}`);
      console.log(`Current favorites: ${JSON.stringify(state.favorites)}`);
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(
        (strainId) => strainId !== action.payload
      );
    },
  },
});

const storesSlice = createSlice({
  name: "stores",
  initialState: [],
  reducers: {
    setStores: (state, action) => {
      // directly mutate the state
      state.length = 0;
      state.push(...action.payload);
    },
  },
});

const strainsSlice = createSlice({
  name: "strains",
  initialState: [],
  reducers: {
    setStrains: (state, action) => {
      // directly mutate the state
      state.length = 0;
      state.push(...action.payload);
    },
  },
});

export const {
  setUser,
  removeUser,
  updateUserRoles,
  setFavorites,
  addToFavorites,
  removeFromFavorites,
} = userSlice.actions;

export const { setStrains } = strainsSlice.actions;
export const { setStores } = storesSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    strains: strainsSlice.reducer,
    stores: storesSlice.reducer,
  },
});

export default store;
