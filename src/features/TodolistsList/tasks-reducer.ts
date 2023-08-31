import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType
} from "api/todolists-api";
import { appActions } from "app/app-reducer";
import { AppRootStateType, AppThunk } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { todoActions } from "./todolists-reducer";

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasks.splice(index, 1);
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const tasks = state[action.payload.task.todoListId];
      state[action.payload.task.todoListId] = [action.payload.task, ...tasks];
    },
    updateTask: (
      state,
      action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todolistId: string }>
    ) => {
      const tasks = state[action.payload.todolistId];
      const updatedTasks = tasks.map((task) =>
        task.id === action.payload.taskId ? { ...task, ...action.payload.model } : task
      );
      state[action.payload.todolistId] = updatedTasks;
    },
    setTasks: (state, action: PayloadAction<{ tasks: TaskType[]; todoID: string }>) => {
      state[action.payload.todoID] = action.payload.tasks;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todoActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todoActions.deleteTodolist, (state, action) => {
        delete state[action.payload.todoID];
      })
      .addCase(todoActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((el) => (state[el.id] = []));
      });
  },
});
export const taskAction = slice.actions;
export const taskReducer = slice.reducer;

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', (todolistId: string, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI
  dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI
      .getTasks(todolistId)
      .then((res) => {
        dispatch(taskAction.setTasks({tasks: res.data.items, todoID: todolistId}));
        dispatch(appActions.setAppStatus({ status: "idle" }));
      })
})

export const fetchTasksTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI
      .getTasks(todolistId)
      .then((res) => {
        dispatch(taskAction.setTasks({tasks: res.data.items, todoID: todolistId}));
        dispatch(appActions.setAppStatus({ status: "idle" }));
      })
  };

export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI
      .deleteTask(todolistId, taskId)
      .then((res) => {
        dispatch(taskAction.removeTask({ taskId, todolistId }));
        dispatch(appActions.setAppStatus({ status: "idle" }));
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e);
      });
  };

export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(taskAction.addTask({ task: res.data.data.item }));
          dispatch(appActions.setAppStatus({ status: "idle" }));
        } else {
          handleServerAppError<{ item: TaskType }>(dispatch, res.data);
        }
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e);
      });
  };

export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      console.warn("task not found in the state");
      return;
    }
    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };
    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        dispatch(taskAction.updateTask({taskId, model: domainModel, todolistId}));
        dispatch(appActions.setAppStatus({ status: "idle" }));
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e);
      });
  };

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
