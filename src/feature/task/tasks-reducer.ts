import { TasksStateType } from "App/App";
import { AddTodoAT, RemoveTodoAT, SetTodosAT } from "feature/todolist/todolists-reducer";
import { TaskStatuses, TaskType, todolistAPI } from "api/todolist-api";
import { AppRootStateType, AppThunkType } from "feature/store/store";

export type TaskActionType = RemoveTaskAT |
  AddTaskAT |
  ChangeTaskTitleAT |
  ChangeTaskStatusAT |
  AddTodoAT |
  RemoveTodoAT |
  SetTodosAT |
  GetTasksAT

type RemoveTaskAT = ReturnType<typeof removeTask>
type AddTaskAT = ReturnType<typeof addTask>
type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitle>
type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatus>
type GetTasksAT = ReturnType<typeof getTasks>

const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionType): TasksStateType => {

  switch (action.type) {
    case "REMOVE_TASK":
      return {
        ...state,
        [action.payload.todoID]: state[action.payload.todoID].filter(task => task.id !== action.payload.taskID)
      };
    case "ADD_TASK":
      return {
        ...state, [action.payload.task.todoListId]:
          [action.payload.task, ...state[action.payload.task.todoListId]]
      };

    case "CHANGE_TASK_TITLE":
      return {
        ...state, [action.payload.todoID]: state[action.payload.todoID].map(task => task.id === action.payload.taskID
          ? { ...task, title: action.payload.title } : task)
      };
    case "CHANGE_TASK_STATUS":
      return {
        ...state, [action.payload.todoID]: state[action.payload.todoID].map(task => task.id === action.payload.taskID
          ? { ...task, status: action.payload.status } : task)
      };
    case "ADD_TODO":
      return { ...state, [action.payload.todoID]: [] };
    case "REMOVE_TODO":
      const { [action.payload.todoID]: [], ...rest } = state;
      return rest;
    case "SET_TODOS":
      const stateCopy = { ...state };
      action.payload.todos.forEach((tl) => {
        stateCopy[tl.id] = [];
      });
      return stateCopy;

    case "SET_TASKS": {
      const stateCopy = { ...state };
      stateCopy[action.payload.todoID] = action.payload.tasks;
      return stateCopy;
    }
    default :
      return state;
  }
};

export const removeTask = (taskID: string, todoID: string) => {
  return {
    type: "REMOVE_TASK",
    payload: {
      taskID, todoID
    }
  } as const;
};

export const addTask = (task: TaskType) => {
  return {
    type: "ADD_TASK",
    payload: {
      task
    }
  } as const;
};

export const changeTaskTitle = (taskID: string, todoID: string, title: string) => {
  return {
    type: "CHANGE_TASK_TITLE",
    payload: {
      taskID, todoID, title
    }
  } as const;
};

export const changeTaskStatus = (taskID: string, todoID: string, status: number) => {
  return {
    type: "CHANGE_TASK_STATUS",
    payload: {
      taskID, todoID, status
    }
  } as const;
};
export const getTasks = (tasks: any, todoID: string) => {
  console.log(tasks);
  return {
    type: "SET_TASKS",
    payload: {
      tasks, todoID
    }
  } as const;
};

//Thunk Creators
export const fetchTasks = (todoID: string): AppThunkType => (dispatch) => {
  todolistAPI.getTasks(todoID)
    .then((res) => {
      dispatch(getTasks(res.data.items, todoID));
    });
};
export const deleteTask = (todoID: string, taskID: string): AppThunkType => (dispatch) => {
  todolistAPI.deleteTask(todoID, taskID).then(res => {
    dispatch(removeTask(taskID, todoID));
  });
};
export const addNewTask = (todoID: string, title: string):AppThunkType => (dispatch) => {
  todolistAPI.addTask(todoID, title).then( res => {
    dispatch(addTask(res.data.data.item))
  })
};
export const updateTaskStatus = (taskID: string, todoID: string, status: TaskStatuses): AppThunkType => {
  return (dispatch, getState: () => AppRootStateType) => {
    const allTasksFromState = getState().tasks;
    const tasksForCurrentTodolist = allTasksFromState[todoID]
    const task = tasksForCurrentTodolist.find(t => {
      return t.id === taskID
    })
    console.log(status,'this is status id TC');
    if (task) {
      todolistAPI.updateTask(todoID, taskID, {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: status
      }).then(() => {
        dispatch(changeTaskStatus(taskID, todoID, status))
      })
    }
  }
}
