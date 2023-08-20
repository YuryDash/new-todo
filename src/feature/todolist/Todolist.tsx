import React, { memo, useCallback, useEffect } from "react";

import { Delete } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import { EditableSpan } from "components/EditableSpan";
import { FilterType } from "feature/todolist/todolists-reducer";
import { AddItemForm } from "components/AddItemForm";
import { Task } from "feature/task/Task";
import { fetchTasks } from "feature/task/tasks-reducer";
import { useAppDispatch } from "feature/store/store";
import { TaskStatuses, TaskType } from "api/todolist-api";

type TodolistPropsType = {
  todoID: string
  title: string
  task: Array<TaskType>
  removeTask: (id: string, todoID: string) => void
  changeFilter: (filter: FilterType, todoID: string) => void
  addTask: (todoID: string, title: string) => void
  onChangeTaskStatus: (taskID: string, status: TaskStatuses, todoID: string) => void
  filter: FilterType
  removeTodo: (todoID: string) => void
  changeTaskTitle: (taskID: string, title: string, todoID: string) => void
  todoChangeTitle: (title: string, todoID: string) => void
}

export const Todolist: React.FC<TodolistPropsType> = memo(({
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
  console.log("Todolist called");
const dispatch = useAppDispatch()

  useEffect(() => {
  dispatch( fetchTasks(todoID) )
  }, []);

  const onClickChangeFilterHandle = useCallback((filter: FilterType) => {
    changeFilter(filter, todoID);
  },[changeFilter, todoID]);

  const deleteTodoHandler = () => {
    removeTodo(todoID);
  };
  const addTaskHandler = useCallback((title: string) => {
    addTask(todoID, title);
  }, [todoID, addTask]);
  const onTodoTitleChange = useCallback((title: string) => {
    todoChangeTitle(title, todoID);
  },[todoChangeTitle, todoID]);


  let taskMapped = task;
  if (filter === 'active') {
    taskMapped = task.filter( t => t.status === TaskStatuses.New )
  }
  if (filter === 'completed') {
   taskMapped = task.filter( t => t.status === TaskStatuses.Completed )
  }
  const taskForTodo = taskMapped.map(task => {
    const onClickDeleteHandler = (taskID: string) => {
      removeTask( taskID, todoID )
    };
    const onChangeTaskStatusHandle = (taskID: string, checked: TaskStatuses) => {
      onChangeTaskStatus(taskID, checked, todoID);
    };

    const onTitleChange = (taskID: string, title: string) => {
      console.log(title, "title in todos");
      changeTaskTitle(taskID, title, todoID);
    };
    return (
      <Task key={task.id}
            task={task}
            onClickDeleteHandler={onClickDeleteHandler}
            onChangeTaskStatusHandle={onChangeTaskStatusHandle}
            onTitleChange={onTitleChange} />
    );
  });

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
        {taskForTodo}
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
});