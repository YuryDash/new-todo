import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ResponseResultCode, todolistsAPI, TodolistType} from "common/api/todolists-api";
import {appActions, RequestStatusType} from "app/app-reducer";
import {AppThunk} from "app/store";
import {AxiosError} from "axios";
import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {handleServerAppError} from "common/utils/handleServerAppError";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    },
    deleteTodolist: (state, action: PayloadAction<{ todoID: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todoID);
      if (index !== -1) state.splice(index, 1);
    },
    changeTodolistTitle: (state, action: PayloadAction<{ todoID: string; title: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todoID);
      if (index !== -1) state[index].title = action.payload.title;
    },
    changeTodolistFilter: (state, action: PayloadAction<{todoID: string, filter: FilterValuesType}>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todoID);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeTodolistStatus: (state, action: PayloadAction<{todoID: string, entityStatus: RequestStatusType}>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todoID);
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
    },
    setTodolists: (state, action: PayloadAction<{todolists: TodolistType[]}>) => {
      return action.payload.todolists.map( el => ({...el, filter:'all', entityStatus:'idle'}) )
    }
  },
});
export const todoActions = slice.actions;
export const todoReducer = slice.reducer;
export type TodosActionsType = ReturnType<typeof slice.getInitialState>;

export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(todoActions.setTodolists({todolists: res.data}));
        dispatch(appActions.setAppStatus({ status: "idle" }));
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e);
      });
  };
};

export const removeTodolistTC = (todolistId: string): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todoActions.changeTodolistStatus({todoID: todolistId, entityStatus: "loading"}));
    todolistsAPI
      .deleteTodolist(todolistId)
      .then(() => {
        dispatch(todoActions.deleteTodolist({todoID: todolistId}));
        dispatch(appActions.setAppStatus({ status: "idle" }));
      })
      .catch((e: AxiosError) => {
        handleServerNetworkError(e, dispatch);
      });
  };
};

export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI
      .createTodolist(title)
      .then((res) => {
        if (res.data.resultCode === ResponseResultCode.OK) {
          dispatch(todoActions.addTodolist({todolist: res.data.data.item}));
          dispatch(appActions.setAppStatus({ status: "idle" }));
        } else {
          handleServerAppError<{ item: TodolistType }>(dispatch, res.data);
        }
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e);
      });
  };
};
export const changeTodolistTitleTC = (todoID: string, title: string): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI
      .updateTodolist(todoID, title)
      .then(() => {
        dispatch(todoActions.changeTodolistTitle({todoID, title}));
        dispatch(appActions.setAppStatus({ status: "idle" }));
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e);
      });
  };
};

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
