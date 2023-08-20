import axios from "axios";

export type TodolistTypeResponse = {
  id: string
  addedDate: string
  order: number
  title: string
}
export type ResponseDataType<D = {}> = {
  resultCode: number
  messages: Array<string>
  fieldsErrors: Array<string>
  data: D
}

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists",
  withCredentials: true
});
export const todolistAPI = {
  getTodo() {
    return instance.get<TodolistTypeResponse[]>("");
  },
  createTodo(title: string) {
    return instance.post<ResponseDataType<{ item: TodolistTypeResponse }>>(``, { title })
  },
  deleteTodo(todoID: string) {
    return instance.delete<ResponseDataType>(`/${todoID}`);
  },
  updateTodo(title: string) {
    return instance.put<ResponseDataType>(``, { title });
  },
  getTasks(todoID: string) {
    return instance.get(`/${todoID}/tasks`)
  },
  deleteTask(todoID: string, taskID: string) {
    return instance.delete<ResponseDataType>( `${todoID}/tasks/${taskID}`)
  },
  addTask( todoID:string, title: string ){
    return instance.post<ResponseDataType<{item: TaskType}>>( `${todoID}/tasks`, {title} )
  },
  updateTask(todoID: string, taskID: string, taskProperties: UpdateTaskModelType) {
    return instance.put<ResponseDataType<{item: TaskType}>>( `${todoID}/tasks/${taskID}`, {taskProperties} )
  }
};

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};