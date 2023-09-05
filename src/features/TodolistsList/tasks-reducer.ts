import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import {
  ArgTaskAddType,
  ArgTaskUpdateType,
  ResponseResultCode,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "common/api/todolists-api";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { todoActions } from "./todolists-reducer";
added structure and createAppThunk
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
    // updateTask: (
    //   state,
    //   action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todolistId: string }>
    // ) => {
    //   const tasks = state[action.payload.todolistId];
    //   const updatedTasks = tasks.map((task) =>
    //     task.id === action.payload.taskId ? { ...task, ...action.payload.model } : task
    //   );
    //   state[action.payload.todolistId] = updatedTasks;
    // },
    // setTasks: (state, action: PayloadAction<{ tasks: TaskType[]; todoID: string }>) => {
    //   state[action.payload.todoID] = action.payload.tasks;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todoID] = action.payload.tasks;
      })
      .addCase(todoActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todoActions.deleteTodolist, (state, action) => {
        delete state[action.payload.todoID];
      })
      .addCase(todoActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((el) => (state[el.id] = []));
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const updatedTasks = tasks.map((task) =>
          task.id === action.payload.taskId ? { ...task, ...action.payload.domainModel } : task
        );
        state[action.payload.todolistId] = updatedTasks;
      });
  },
});

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todoID: string }, string>(
  "tasks/fetchTasks",
  async (todoID, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTasks(todoID);
      dispatch(appActions.setAppStatus({ status: "idle" }));
      return { tasks: res.data.items, todoID };
    } catch (error: any) {
      handleServerNetworkError(dispatch, error);
      return rejectWithValue(null);
    }
  }
);

export const addTask = createAppAsyncThunk<{ task: TaskType }, ArgTaskAddType>(
  "tasks/addTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTask(arg);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "idle" }));
        const task = res.data.data.item;
        return { task };
      } else {
        handleServerAppError(dispatch, res.data);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);
export const removeTask = createAppAsyncThunk<any, { taskID: string; todoID: string }>(
  "tasks/removeTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.deleteTask(arg.taskID, arg.todoID);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "idle" }));
        return res.data.messages;
      } else {
        handleServerAppError(dispatch, res.data);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const updateTask = createAppAsyncThunk<ArgTaskUpdateType, ArgTaskUpdateType>(
  "tasks/updateTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const state = getState();
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
      if (!task) {
        console.warn("task not found in the state");
        return rejectWithValue(null);
      }
      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel,
      };
      const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel);

      if (res.data.resultCode === ResponseResultCode.OK) {
        dispatch(appActions.setAppStatus({ status: "idle" }));
        return { taskId: arg.taskId, domainModel: arg.domainModel, todolistId: arg.todolistId };
      } else {
        handleServerAppError(dispatch, res.data);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

// export const updateTaskTC =
//   (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
//   (dispatch, getState: () => AppRootStateType) => {
//     dispatch(appActions.setAppStatus({ status: "loading" }));
//     const state = getState();
//     const task = state.tasks[todolistId].find((t) => t.id === taskId);
//     if (!task) {
//       console.warn("task not found in the state");
//       return;
//     }
//     const apiModel: UpdateTaskModelType = {
//       deadline: task.deadline,
//       description: task.description,
//       priority: task.priority,
//       startDate: task.startDate,
//       title: task.title,
//       status: task.status,
//       ...domainModel,
//     };
//     todolistsAPI
//       .updateTask(todolistId, taskId, apiModel)
//       .then((res) => {
//         dispatch(taskAction.updateTask({ taskId, model: domainModel, todolistId }));
//         dispatch(appActions.setAppStatus({ status: "idle" }));
//       })
//       .catch((e) => {
//         handleServerNetworkError(dispatch, e);
//       });
//   };

export const taskAction = slice.actions;
export const taskReducer = slice.reducer;
export const taskThunk = { fetchTasks, addTask, removeTask, updateTask };

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
