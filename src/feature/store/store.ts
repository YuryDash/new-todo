import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { TaskActionType, tasksReducer } from "feature/task/tasks-reducer";
import { TodoActionType, todolistsReducer } from "feature/todolist/todolists-reducer";
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { useDispatch } from "react-redux";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, any, TodoActionType | TaskActionType>

export type TypedDispatch = ThunkDispatch<AppRootStateType, unknown, TodoActionType | TaskActionType>
export const useAppDispatch = () => useDispatch<TypedDispatch>()
