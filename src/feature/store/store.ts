import { combineReducers, legacy_createStore } from "redux";
import { tasksReducer } from "feature/task/tasks-reducer";
import { todolistsReducer } from "feature/todolist/todolists-reducer";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer
})

export const store = legacy_createStore(rootReducer)
export type AppRootStateType = ReturnType<typeof rootReducer>