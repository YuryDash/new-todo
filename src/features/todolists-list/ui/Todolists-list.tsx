import React, {useCallback, useLayoutEffect} from "react";
import {useSelector} from "react-redux";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "common/components";
import {Todolist} from "features/todolists-list/todolists/todolist/ui/Todolist";
import {Navigate} from "react-router-dom";
import {useActions} from "common/hooks";
import {selectIsLoggedIn} from "features/auth/model/auth.selectors";
import {selectTasks} from "features/todolists-list/tasks/model/tasks.selectors";
import {selectTodolists} from "features/todolists-list/todolists/todolist/model/todolists.selectors";
import {
  todolistsThunks
} from "features/todolists-list/todolists/todolist/model/todolists.reducer";

export const TodolistsList = () => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const {addTodolist, fetchTodolists} = useActions(todolistsThunks);
  useLayoutEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolists();
  }, []);

  const addTodolistCallback = useCallback((title: string) => {
    return addTodolist(title);
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"}/>;
  }

  return (
    <>
      <Grid container style={{padding: "20px"}}>
        <AddItemForm addItem={addTodolistCallback}/>
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{padding: "10px"}}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
