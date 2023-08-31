import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "app/app-reducer";
import { authReducer } from "features/Login/auth/auth-reducer";
import { taskReducer } from "features/TodolistsList/tasks-reducer";
import { todoReducer } from "features/TodolistsList/todolists-reducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AnyAction, combineReducers } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

const rootReducer = combineReducers({
  tasks: taskReducer,
  todolists: todoReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>;

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;
