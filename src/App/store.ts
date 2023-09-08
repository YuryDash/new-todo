import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "app/app-reducer";
import { authReducer } from "features/Login/auth/auth-reducer";
import { taskReducer } from "features/TodolistsList/tasks-reducer";
import { todoReducer } from "features/TodolistsList/todolists-reducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { ThunkAction } from "redux-thunk";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

// const rootReducer = combineReducers({
//   tasks: taskReducer,
//   todolists: todoReducer,
//   app: appReducer,
//   auth: authReducer,
// });

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    todolists: todoReducer,
    app: appReducer,
    auth: authReducer,
  },
});
export type AppRootStateType = ReturnType<typeof store.getState>;
// export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;
