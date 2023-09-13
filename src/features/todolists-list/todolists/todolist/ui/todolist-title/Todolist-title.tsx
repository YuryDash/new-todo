import {EditableSpan} from "common/components";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import React, {FC, useCallback} from "react";
import {TodolistDomainType, todolistsThunks} from "features/todolists-list/todolists/todolist/model/todolists.reducer";
import {useActions} from "common/hooks";

type Props = {
  todolist: TodolistDomainType
}
export const TodolistTitle:FC<Props> = ({
todolist
                                        }) => {
  const {removeTodolist, changeTodolistTitle, } = useActions(todolistsThunks);

  const changeTodolistTitleHandler = (title: string) => changeTodolistTitle({id: todolist.id, title})
  const removeTodolistHandler = () => removeTodolist(todolist.id);

  return  (
    <>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler}/>
        <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
          <Delete/>
        </IconButton>
      </h3>
  </>
  )
}