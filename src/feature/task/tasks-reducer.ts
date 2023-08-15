import { TasksStateType } from "App/App";
import { TaskType } from "feature/todolist/Todolist";
import { v1 } from "uuid";
import { AddTodoAT, RemoveTodoAT } from "feature/todolist/todolists-reducer";

type TaskActionType = RemoveTaskAT |
  AddTaskAT |
  ChangeTaskTitleAT |
  ChangeTaskStatusAT |
  AddTodoAT |
  RemoveTodoAT
type RemoveTaskAT = ReturnType<typeof removeTask>
type AddTaskAT = ReturnType<typeof addTask>
type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitle>
type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatus>

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionType): TasksStateType => {

  switch (action.type) {
    case "REMOVE_TASK":
      return { ...state, [action.payload.todoID]: state[action.payload.todoID].filter( task => task.id !== action.payload.taskID ) }
    case "ADD_TASK":
      const newTask:TaskType = {id: v1(), title:action.payload.title, isDone: false}
      return { ...state, [action.payload.todoID]: [newTask, ...state[action.payload.todoID]] }

    case "CHANGE_TASK_TITLE":
      return {...state, [action.payload.todoID]: state[action.payload.todoID].map( task => task.id === action.payload.taskID
          ? {...task, title: action.payload.title} : task) }
    case "CHANGE_TASK_STATUS":
      return {...state, [action.payload.todoID]: state[action.payload.todoID].map( task => task.id === action.payload.taskID
          ? {...task, isDone: action.payload.status} : task) }
    case "ADD_TODO":
      return {...state, [action.payload.todoID]: []}
    case "REMOVE_TODO":
      const {[action.payload.todoID]: [], ...rest} = state
      return rest
    default :
      return state
  }
};

export const removeTask = (taskID: string, todoID:string) => {
  return {
    type: "REMOVE_TASK",
    payload: {
      taskID, todoID
    }
  } as const
}

export const addTask = (todoID:string, title: string) => {
  return {
    type: "ADD_TASK",
    payload: {
      todoID, title
    }
  } as const
}

export const changeTaskTitle = (taskID: string, todoID:string, title: string) => {
  return {
    type: "CHANGE_TASK_TITLE",
    payload: {
      taskID, todoID, title
    }
  } as const
}

export const changeTaskStatus = (taskID: string, todoID:string, status: boolean) => {
  return {
    type: "CHANGE_TASK_STATUS",
    payload: {
      taskID, todoID, status
    }
  } as const
}