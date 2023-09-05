import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ResponseResultCode} from "common/api/todolists-api";
import {AppThunk} from "app/store";
import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {FormType} from "../Login";
import {appActions} from "app/app-reducer";
import {todoActions} from "features/TodolistsList/todolists-reducer";
import {handleServerAppError} from "common/utils/handleServerAppError";
import {authAPI} from "features/Login/auth/authAPI";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});
export const authReducer = slice.reducer;
export const authActions = slice.actions;

export const loginWatcher =
  (formData: FormType): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      const res = await authAPI.login(formData);
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        dispatch(appActions.setAppStatus({ status: "idle" }));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  };
export const logoutWatcher = (): AppThunk => async (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === ResponseResultCode.OK) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
      dispatch(todoActions.setTodolists({ todolists: [] }));
      dispatch(appActions.setAppStatus({ status: "idle" }));
    } else {
      handleServerAppError(dispatch, res.data);
    }
  } catch (error) {
    console.log(error);
    handleServerNetworkError(error, dispatch);
  }
};

export const authMe = (): AppThunk => async (dispatch) => {
  try {
    const res = await authAPI.logMe();
    if (res.data.resultCode === ResponseResultCode.OK) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
    } else {
      handleServerAppError(dispatch, res.data);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
  }
};
