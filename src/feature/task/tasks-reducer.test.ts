import { TasksStateType } from "App/App";
import { addTask, changeTaskStatus, changeTaskTitle, removeTask, tasksReducer } from "feature/task/tasks-reducer";
import { v1 } from "uuid";
import { TaskPriorities, TaskStatuses } from "api/todolist-api";

let todoID_1: string;
let todoID_2: string;
let startState: TasksStateType;

beforeEach(() => {
  todoID_1 = v1();
  todoID_2 = v1();

  startState = {
    [todoID_1]: [
      {
        description: "",
        title: "CSS",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: todoID_1,
        order: 0,
        addedDate: ""
      },
      {
        description: "",
        title: "JS",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "2",
        todoListId: todoID_1,
        order: 0,
        addedDate: ""
      }
    ],

    [todoID_2]: [
      {
        description: "",
        title: "bread",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: todoID_2,
        order: 0,
        addedDate: ""
      }
    ]
  };
});

test("correct task should be deleted from correct array", () => {
  const endState = tasksReducer(startState, removeTask("2", todoID_1));

  expect(endState).toEqual({
    [todoID_1]: [
      {
        description: "",
        title: "CSS",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: todoID_1,
        order: 0,
        addedDate: ""
      },
    ],
    [todoID_2]: [
      {
        description: "",
        title: "bread",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: todoID_2,
        order: 0,
        addedDate: ""
      }
    ]
  });
});

test("in correct todo should be added task", () => {
  const endState = tasksReducer(startState, addTask(todoID_1, "dangerous internet league"));

  expect(endState[todoID_1].length).toBe(4);
  expect(endState[todoID_2].length).toBe(3);
  expect(endState[todoID_1][0].id).toBeDefined();
  expect(endState[todoID_1][0].title).toBe("dangerous internet league");
  expect(endState[todoID_1][0].isDone).toBe(false);
});

test("title of specified task should be changed", () => {
  const endState = tasksReducer(startState, changeTaskTitle("1", todoID_1, "dangerous internet league"));

  expect(endState[todoID_1].length).toBe(3);
  expect(endState[todoID_2].length).toBe(3);
  expect(endState[todoID_1][0].title).toBe("dangerous internet league");
  expect(endState[todoID_2][0].title).toBe("bread");
  expect(endState[todoID_1][1].title).toBe("JS");
  expect(endState[todoID_2][1].title).toBe("milk");
});

test("status of specified task should be changed", () => {
  const endState = tasksReducer(startState, changeTaskStatus("1", todoID_1, true));

  expect(endState[todoID_1][0].isDone).toBe(true);
  expect(endState[todoID_2][0].isDone).toBe(false);
  expect(endState[todoID_1][1].isDone).toBe(true);
  expect(endState[todoID_2][1].isDone).toBe(true);
});