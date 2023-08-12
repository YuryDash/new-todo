import React, { ChangeEvent } from "react";
import { AddItemForm } from "./AddItemForm";
import { FilterType } from "./App";
import { EditableSpan } from "./EditableSpan";
import { Delete } from "@mui/icons-material";
import { Checkbox, IconButton, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";

type TodolistPropsType = {
  title: string
  task: Array<TaskType>
  removeTask: (id: string, todoID: string) => void
  changeFilter: (filter: FilterType, todoID: string) => void
  addTask: (title: string, todoID: string) => void
  onChangeTaskStatus: (taskID: string, isDone: boolean, todoID: string) => void
  filter: FilterType
  todoID: string
  removeTodo: (todoID: string) => void
  changeTaskTitle: (taskID: string, title: string, todoID: string) => void
  todoChangeTitle: (title: string, todoID: string) => void
}

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}
export const Todolist: React.FC<TodolistPropsType> = ({
                                                        title,
                                                        task,
                                                        removeTask,
                                                        changeFilter,
                                                        filter,
                                                        addTask,
                                                        onChangeTaskStatus,
                                                        todoID,
                                                        removeTodo,
                                                        changeTaskTitle,
                                                        todoChangeTitle
                                                      }) => {

  const taskMapped = task.map(el => {
    const onClickDeleteHandler = () => {
      removeTask(el.id, todoID);
    };
    const onChangeTaskStatusHandle = (e: ChangeEvent<HTMLInputElement>) => {
      onChangeTaskStatus(el.id, e.currentTarget.checked, todoID);
    };
    const onTitleChange = (title: string) => {
      changeTaskTitle(el.id, title, todoID);
    };
    return (
      <ul key={el.id}>
        <li style={el.isDone ? {opacity:'0.6', textDecoration:"line-through"} : {}}>
          <Checkbox color={'primary'} checked={el.isDone} onChange={onChangeTaskStatusHandle} />
          <EditableSpan title={el.title} onTitleChange={onTitleChange} />
          <IconButton onClick={onClickDeleteHandler}>
            <Tooltip title="Удалить задачу">
              <Delete />
            </Tooltip>
          </IconButton>
        </li>
      </ul>
    );
  });
  const onClickChangeFilterHandle = (filter: FilterType) => {
    changeFilter(filter, todoID);
  };
  const deleteTodoHandler = () => {
    removeTodo(todoID);
  };
  const addTaskHandler = (title: string) => {
    addTask(title, todoID);
  };
  const onTodoTitleChange = (title: string) => {
    todoChangeTitle(title, todoID);
  };
  return (
    <div>
      <div>
        <h3>
          <EditableSpan title={title} onTitleChange={onTodoTitleChange} />
          <IconButton onClick={deleteTodoHandler}>
            <Tooltip title="Удалить список задач">
              <Delete />
            </Tooltip>
          </IconButton>
        </h3>
        <AddItemForm addItems={addTaskHandler} />
        {taskMapped}
        <div>
          <Button
            variant={filter === "all" ? "outlined" : "text"}
            color={"primary"}
            onClick={() => onClickChangeFilterHandle("all")}>All</Button>
          <Button
            variant={filter === "active" ? "outlined" : "text"}
            color={"secondary"}
            onClick={() => onClickChangeFilterHandle("active")}>Active</Button>
          <Button
            variant={filter === "completed" ? "outlined" : "text"}
            color={"success"}
            onClick={() => onClickChangeFilterHandle("completed")}>Completed</Button>
        </div>
      </div>
    </div>
  );
};