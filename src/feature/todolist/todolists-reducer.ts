import { v1 } from "uuid";
import { todolistAPI, TodolistTypeResponse } from "api/todolist-api";
import { AppThunkType } from "feature/store/store";

export type TodolistType = {
  id: string
  filter: FilterType
  title: string
}
export type FilterType = "all" | "active" | "completed"
export type TodoActionType = RemoveTodoAT | AddTodoAT | ChangeTodoTitleAT | ChangeTodoFilterAT | SetTodosAT
export type RemoveTodoAT = ReturnType<typeof removeTodo>
export type AddTodoAT = ReturnType<typeof addTodo>
type ChangeTodoTitleAT = ReturnType<typeof changeTodoTitle>
type ChangeTodoFilterAT = ReturnType<typeof changeTodoFilter>
export type SetTodosAT = ReturnType<typeof setTodos>

const initialState: TodolistType[] = [];

export const todolistsReducer = (state = initialState, action: TodoActionType): TodolistType[] => {
  switch (action.type) {
    case "REMOVE_TODO" :
      return state.filter(todo => todo.id !== action.payload.todoID);
    case "ADD_TODO" :
      return [{
        id: action.payload.todoID,
        title: action.payload.title,
        filter: "all"
      }, ...state];
    case "CHANGE_TODO_TITLE" :
      const todolist = state.find(tl => tl.id === action.payload.todoID);
      if (todolist) {
        todolist.title = action.payload.title;
      }
      return [...state]
    case "CHANGE_TODO_FILTER":
      return state.map(el => el.id === action.payload.todoID
        ? { ...el, filter: action.payload.filter } : el);
    case "SET_TODOS":
      return action.payload.todos.map( el => ({
        ...el, filter: "all"
      }) )
    default:
      return state;
  }
};

// ActionCreators
export const removeTodo = (todoID: string) => {
  return {
    type: "REMOVE_TODO",
    payload: { todoID }
  } as const;
};
export const addTodo = (title: string) => {
  const todoID = v1();
  return {
    type: "ADD_TODO",
    payload: { title, todoID }
  } as const;
};
export const changeTodoTitle = (todoID: string, title: string) => {
  return {
    type: "CHANGE_TODO_TITLE",
    payload: { todoID, title }
  } as const;
};
export const changeTodoFilter = (todoID: string, filter: FilterType) => {
  return {
    type: "CHANGE_TODO_FILTER",
    payload: { todoID, filter }
  } as const;
};
export const setTodos = (todos: TodolistTypeResponse[]) => {
  return {
    type: "SET_TODOS",
    payload: {
      todos
    }
  } as const
}

export const fetchTodos = (): AppThunkType => (dispatch) => {
  todolistAPI.getTodo()
    .then((res) => {
      dispatch(setTodos(res.data));
    });
};


