import React, { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "app/store";
import {
  addTodolistTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  todoActions,
  TodolistDomainType,
} from "./todolists-reducer";
import { TasksStateType, taskThunk } from "./tasks-reducer";
import { TaskStatuses } from "common/api/todolists-api";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Navigate } from "react-router-dom";

export const TodolistsList: React.FC = () => {
  const todolists = useAppSelector<Array<TodolistDomainType>>((state) => state.todolists);
  const tasks = useAppSelector<TasksStateType>((state) => state.tasks);
  const dispatch = useAppDispatch();
  const isLoggedIn: boolean = useAppSelector<boolean>((state) => state.auth.isLoggedIn);

  useEffect(() => {
    isLoggedIn && dispatch(fetchTodolistsTC());
  }, []);

  const removeTask = useCallback(function (taskID: string, todoID: string) {
    dispatch(taskThunk.removeTask({ taskID, todoID }));
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(taskThunk.addTask({ title, todolistId }));
  }, []);

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    dispatch(taskThunk.updateTask({ todolistId, domainModel: { status }, taskId }));
  }, []);

  const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
    dispatch(taskThunk.updateTask({ taskId, domainModel: { title: newTitle }, todolistId }));
  }, []);

  const changeFilter = useCallback(function (filter: FilterValuesType, todoID: string) {
    dispatch(todoActions.changeTodolistFilter({ todoID, filter }));
  }, []);

  const removeTodolist = useCallback(function (id: string) {
    dispatch(removeTodolistTC(id));
  }, []);

  const changeTodolistTitle = useCallback(function (todoID: string, title: string) {
    dispatch(todoActions.changeTodolistTitle({ todoID, title }));
  }, []);

  const addTodolist = useCallback((title: string) => {
    dispatch(addTodolistTC(title));
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  id={tl.id}
                  title={tl.title}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  filter={tl.filter}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  entityStatus={tl.entityStatus}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
