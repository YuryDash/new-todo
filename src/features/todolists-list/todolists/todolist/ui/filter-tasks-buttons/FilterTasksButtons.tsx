import React, {FC, useCallback} from 'react';
import {Button} from "@mui/material";
import {useActions} from "common/hooks";
import {TodolistDomainType, todolistsActions} from "features/todolists-list/todolists/todolist/model/todolists.reducer";

type Props = {
  todolist: TodolistDomainType;
}
export const FilterTasksButtons:FC<Props> = ({
  todolist
                                             }) => {
  const {changeTodolistFilter} = useActions(todolistsActions);

  const onAllClickHandler = () => changeTodolistFilter({filter:"all", id:todolist.id})

  const onActiveClickHandler = () => changeTodolistFilter({filter:"active", id:todolist.id})

  const onCompletedClickHandler = () => changeTodolistFilter({filter:"completed", id:todolist.id})


  return (
    <>
      <Button
        variant={todolist.filter === "all" ? "outlined" : "text"}
        onClick={onAllClickHandler}
        color={"inherit"}
      >
        All
      </Button>
      <Button
        variant={todolist.filter === "active" ? "outlined" : "text"}
        onClick={onActiveClickHandler}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={todolist.filter === "completed" ? "outlined" : "text"}
        onClick={onCompletedClickHandler}
        color={"secondary"}
      >
        Completed
      </Button>
    </>
  );
};

