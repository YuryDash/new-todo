import React, { ChangeEvent, useState, KeyboardEvent } from "react";
import { FilterType } from "./App";

type TodolistPropsType = {
  title: string
  task: Array<TaskType>
  removeTask: (id: string, todoID: string) => void
  changeFilter: (filter: FilterType, todoID: string) => void
  addTask: (title: string, todoID: string) => void
  onChangeTaskStatus: (taskID: string, isDone: boolean, todoID: string) => void
  todoID: string
  removeTodo: (todoID: string) => void
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
                                                        addTask,
                                                        onChangeTaskStatus,
                                                        todoID,
                                                        removeTodo
                                                      }) => {

  const [taskTitle, setTaskTitle] = useState("");

  const taskMapped = task.map(el => {
    const onClickDeleteHandler = () => {
      removeTask(el.id, todoID);
    };
    const onChangeTaskStatusHandle = (e: ChangeEvent<HTMLInputElement>) => {
      onChangeTaskStatus(el.id, e.currentTarget.checked,todoID);
    };
    return (
      <ul key={el.id}>
        <li>
          <input type="checkbox" checked={el.isDone} onChange={onChangeTaskStatusHandle} />
          <span>{el.title}</span>
          <button onClick={onClickDeleteHandler}>x</button>
        </li>
      </ul>
    );
  });
  const onClickChangeFilterHandle = (filter: FilterType) => {
    changeFilter(filter, todoID);
  };
  const onChangeFieldHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.currentTarget.value);
  };
  const onCLickAddTaskHandle = () => {
    if (taskTitle !== "")
      addTask(taskTitle.trim(), todoID);
    setTaskTitle("");
  };
  const onKeyDownHandle = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onCLickAddTaskHandle();
    }
  };

  const deleteTodoHandler = () => {
    removeTodo( todoID )
  }

  return (
    <div>
      <div>
        <div style={{display:"flex", alignItems:"center"}}>
          <h3>{title}</h3>
          <div>
            <button onClick={deleteTodoHandler}>x</button>
          </div>
        </div>
        <div>
          <input type="text" onChange={onChangeFieldHandle} onKeyDown={onKeyDownHandle} value={taskTitle} />
          <button onClick={onCLickAddTaskHandle}>+</button>
        </div>
        {taskMapped}
        <div>
          <button onClick={() => onClickChangeFilterHandle("all")}>All</button>
          <button onClick={() => onClickChangeFilterHandle("active")}>Active</button>
          <button onClick={() => onClickChangeFilterHandle("completed")}>Completed</button>
        </div>
      </div>
    </div>
  );
};