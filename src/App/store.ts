import { configureStore } from "@reduxjs/toolkit";

import { appReducer } from "app/app.reducer";
import { authSlice } from "features/auth/model/auth.slice";
import {tasksReducer} from "features/todolists-list/tasks/model/tasks.reducer";
import {todolistsReducer} from "features/todolists-list/todolists/todolist/model/todolists.reducer";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authSlice,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
