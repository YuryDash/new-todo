import { todolistsAPI, TodolistType } from "api/todolists-api";
import { Dispatch } from "redux";
import { RequestStatusType, setAppError, SetAppErrorType, setAppStatus, SetStatusType } from "app/app-reducer";
import { AxiosError } from "axios";

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter(tl => tl.id !== action.id);
    case "ADD-TODOLIST":
      return [{ ...action.todolist, filter: "all", entityStatus: "idle" }, ...state];
    case "CHANGE-TODOLIST-TITLE":
      return state.map(tl => tl.id === action.id ? { ...tl, title: action.title } : tl);
    case "CHANGE-TODOLIST-FILTER":
      return state.map(tl => tl.id === action.id ? { ...tl, filter: action.filter } : tl);
    case "SET-TODOLISTS":
      return action.todolists.map(tl => ({ ...tl, filter: "all", entityStatus: "idle" }));
    case "CHANGE-ENTITY-STATUS":
      return state.map( el => el.id === action.todolistId ? {...el, entityStatus: 'loading'} : el )
    default:
      return state;
  }
};

export const removeTodolistAC = (id: string) => ({ type: "REMOVE-TODOLIST", id } as const);
export const addTodolistAC = (todolist: TodolistType) => ({ type: "ADD-TODOLIST", todolist } as const);
export const changeTodolistTitleAC = (id: string, title: string) => ({
  type: "CHANGE-TODOLIST-TITLE",
  id,
  title
} as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
  type: "CHANGE-TODOLIST-FILTER",
  id,
  filter
} as const);
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({ type: "SET-TODOLISTS", todolists } as const);
export const setTodoEntityStatus = (todolistId: string) => {
  return {
    type: "CHANGE-ENTITY-STATUS",
    todolistId
  } as const
};

export const fetchTodolistsTC = () => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus("loading"));
    todolistsAPI.getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC(res.data));
        dispatch(setAppStatus("idle"));
      });
  };
};
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus("loading"));
    todolistsAPI.deleteTodolist(todolistId)
      .then(() => {
        dispatch(removeTodolistAC(todolistId));
        dispatch(setAppStatus("idle"));
      }).catch((e: AxiosError) => {
      dispatch(setAppError(e.message));
      dispatch(setAppStatus("idle"));
    });
  };
};
export const addTodolistTC = (title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus("loading"));
    todolistsAPI.createTodolist(title)
      .then((res) => {
        dispatch(addTodolistAC(res.data.data.item));
        dispatch(setAppStatus("idle"));

      });
  };
};
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus("loading"));
    todolistsAPI.updateTodolist(id, title)
      .then(() => {
        dispatch(changeTodolistTitleAC(id, title));
        dispatch(setAppStatus("idle"));

      });
  };
};

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type SetTodoEntityStatus = ReturnType<typeof setTodoEntityStatus>
type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodolistsActionType
  | SetStatusType
  | SetAppErrorType
  | SetTodoEntityStatus
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType,
  entityStatus: RequestStatusType
}
