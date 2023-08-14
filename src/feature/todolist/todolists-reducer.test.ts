import {
  addTodo,
  changeTodoFilter,
  changeTodoTitle,
  removeTodo,
  todolistsReducer,
  TodolistType
} from "feature/todolist/todolists-reducer";
import { v1 } from "uuid";

let todoID_1: string;
let todoID_2: string;
let startState: TodolistType[];

beforeEach(() => {
  todoID_1 = v1();
  todoID_2 = v1();
  startState = [
    { id: todoID_1, title: "What to learn", filter: "all" },
    { id: todoID_2, title: "What to buy", filter: "all" }
  ];
});

test("correct todo should be remove", () => {
  const endState = todolistsReducer(startState, removeTodo(todoID_1));

  expect(endState.length).toBe(1);
  expect(endState[0].title).toBe("What to buy");
});

test("correct todo should be added", () => {
  const endState = todolistsReducer(startState, addTodo("LoL :D"));

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe("LoL :D");
  expect(endState[endState.length - 1].title).toBe("What to buy");
});

test("correct todo should be change title", () => {
  const endState = todolistsReducer(startState, changeTodoTitle(todoID_1, "test change"));

  expect(endState.length).toBe(2);
  expect(endState[0].title).toBe("test change");
  expect(endState[endState.length - 1].title).toBe("What to buy");
});

test("correct todo should be change filter", () => {
  const endState = todolistsReducer(startState, changeTodoFilter(todoID_1, "completed"));

  expect(endState.length).toBe(2);
  expect(endState[0].filter).toBe("completed");
  expect(endState[endState.length - 1].filter).toBe("all");
});