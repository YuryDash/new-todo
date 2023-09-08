import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseResponseType, ResponseResultCode } from "common/api/todolists-api";
import { AppThunk } from "app/store";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { FormType } from "../Login";
import { appActions } from "app/app-reducer";
import { todoActions } from "features/TodolistsList/todolists-reducer";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { authAPI } from "features/Login/auth/authAPI";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, FormType, {rejectValue: BaseResponseType | null}>("auth/login", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await authAPI.login(arg);
    if (res.data.resultCode === ResponseResultCode.OK) {
      dispatch(appActions.setAppStatus({ status: "idle" }));
      return { isLoggedIn: true };
    } else {
      const isShowAppError = !res.data.fieldsErrors.length
      handleServerAppError(dispatch, res.data, isShowAppError);
      return rejectWithValue(res.data); 
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

const logout = createAppAsyncThunk<{ isLoggedIn: false }, undefined>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === ResponseResultCode.OK) {
      dispatch(todoActions.setTodolists({ todolists: [] }));
      dispatch(appActions.setAppStatus({ status: "idle" }));
      return { isLoggedIn: false };
    } else {
      handleServerAppError(dispatch, res.data);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

const authMe = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.logMe();
    if (res.data.resultCode === ResponseResultCode.OK) {
      return { isLoggedIn: true };
    } else {
      // handleServerAppError(dispatch, res.data);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});
// export const authMe_ = (): AppThunk => async (dispatch) => {
//   try {
//     const res = await authAPI.logMe();
//     if (res.data.resultCode === ResponseResultCode.OK) {
//       dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
//     } else {
//       // handleServerAppError(dispatch, res.data);
//     }
//   } catch (error) {
//     handleServerNetworkError(error, dispatch);
//   }
// };

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { login, logout, authMe };
