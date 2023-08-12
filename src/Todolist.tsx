import React, { ChangeEvent } from "react";
import { AddItemForm } from "./AddItemForm";
import { FilterType } from "./App";
import { EditableSpan } from "./EditableSpan";

type TodolistPropsType = {
  title: string
  task: Array<TaskType>
  removeTask: (id: string, todoID: string) => void
  changeFilter: (filter: FilterType, todoID: string) => void
  addTask: (title: string, todoID: string) => void
  onChangeTaskStatus: (taskID: string, isDone: boolean, todoID: string) => void
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
     changeTaskTitle( el.id, title, todoID )
    }
    return (
      <ul key={el.id}>
        <li>
          <input type="checkbox" checked={el.isDone} onChange={onChangeTaskStatusHandle} />
          <EditableSpan title={el.title} onTitleChange={onTitleChange}/>
          <button onClick={onClickDeleteHandler}>x</button>
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
    todoChangeTitle( title, todoID )
  }
  return (
    <div>
      <div>

          <h3>
            <EditableSpan title={title} onTitleChange={onTodoTitleChange}/>
            <button onClick={deleteTodoHandler}>x</button>
          </h3>
          <AddItemForm addItems={addTaskHandler} />
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