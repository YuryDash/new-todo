import React, {FC} from 'react';
import {TodolistDomainType} from "features/todolists-list/todolists/todolist/model/todolists.reducer";
import {Task} from "features/todolists-list/tasks/ui/task/Task";
import {TaskStatuses} from "common/enums";
import {TaskType} from "features/todolists-list/tasks/api/tasks.api";

type Props = {
  todolist: TodolistDomainType
  tasks: TaskType[]
}

export const Tasks: FC<Props> = ({
                                   todolist,
                                   tasks
                                 }) => {
  let tasksForTodolist = tasks;

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  return (
    <>
      {tasksForTodolist.map((t) => (
        <Task
          key={t.id}
          task={t}
          todolistId={todolist.id}
        />
      ))}
    </>
  );
};

