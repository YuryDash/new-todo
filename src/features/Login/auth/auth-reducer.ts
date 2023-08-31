import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ResponseResultCode, todolistsAPI } from "api/todolists-api";
import { AppThunk } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { FormType } from "../Login";
import { appActions } from "app/app-reducer";
import { todoActions } from "features/TodolistsList/todolists-reducer";

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
      const res = await todolistsAPI.login(formData);
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        dispatch(appActions.setAppStatus({ status: "idle" }));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    } catch (error) {
      handleServerNetworkError(dispatch, error as { message: string });
    }
  };
export const logoutWatcher = (): AppThunk => async (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsAPI.logout();
    if (res.data.resultCode === ResponseResultCode.OK) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
      dispatch(todoActions.setTodolists({ todolists: [] }));
      dispatch(appActions.setAppStatus({ status: "idle" }));
    } else {
      handleServerAppError(dispatch, res.data);
    }
  } catch (error) {
    console.log(error);
    handleServerNetworkError(dispatch, error as { message: string });
  }
};

export const authMe = (): AppThunk => async (dispatch) => {
  try {
    const res = await todolistsAPI.logMe();
    if (res.data.resultCode === ResponseResultCode.OK) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
    } else {
      handleServerAppError(dispatch, res.data);
    }
  } catch (error) {
    handleServerNetworkError(dispatch, error as { message: string });
  }
};
