// src/store/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import userApi from '../api/userApi';
import { UserResponse, IErrorResponse } from '@zerodaypoke/strange-types';

// Defining the state interface
interface UserState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk<
  UserResponse,
  User,
  { rejectValue: IErrorResponse }
>('user/login', async (userData, thunkAPI) => {
  try {
    const response = await userApi.logIn(userData);
    if (!response.success) {
      throw new Error(response.message);
    }
    localStorage.setItem('accessToken', response.token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: ErrorResponse }
>('user/logout', async (_, thunkAPI) => {
  try {
    await userApi.logOut();
    localStorage.removeItem('accessToken');
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const checkSession = createAsyncThunk<
  User,
  void,
  { rejectValue: ErrorResponse }
>('user/checkSession', async (_, thunkAPI) => {
  try {
    const response = await userApi.checkSession();
    return response.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.status = 'succeeded';
          state.user = action.payload.user;
          state.error = null;
        },
      )
      .addCase(
        loginUser.rejected,
        (state, action: PayloadAction<ErrorResponse>) => {
          state.status = 'failed';
          state.error = action.payload.message;
        },
      )
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(
        checkSession.rejected,
        (state, action: PayloadAction<ErrorResponse>) => {
          state.status = 'failed';
          state.error = action.payload.message;
        },
      );
  },
});

export default userSlice.reducer;
