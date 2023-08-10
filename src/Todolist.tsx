import React from "react";
import { FilterType } from "./App";

type TodolistPropsType = {
  title: string
  task: Array<TaskType>
  removeTask: (id: string) => void
  changeFilter: (filter: FilterType) => void
}

type TaskType = {
  id: string
  title: string
  isDone: boolean
}
export const Todolist: React.FC<TodolistPropsType> = ({
                                                        title,
                                                        task,
                                                        removeTask,
                                                        changeFilter
                                                      }) => {


  const taskMapped = task.map(el => {
    const onClickDeleteHandler = () => {
      removeTask(el.id);
    };
    return (
      <ul key={el.id}>
        <li>
          <input type="checkbox" checked={el.isDone} />
          <span>{el.title}</span>
          <button onClick={onClickDeleteHandler}>x</button>
        </li>
      </ul>
    );
  });
  const onClickChangeFilterHandle = (filter: FilterType) => {
    changeFilter(filter);
  };
  return (
    <div>
      <div>
        <h3>{title}</h3>
        <div>
          <input />
          <button>+</button>
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