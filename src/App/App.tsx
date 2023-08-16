import React, { useCallback } from "react";
import "App/App.css";
import AppBar from "@mui/material/AppBar";
import { Container, Grid, IconButton, Paper, Toolbar, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import Button from "@mui/material/Button";
import {
  addTodo,
  changeTodoFilter,
  changeTodoTitle,
  FilterType,
  removeTodo,
  TodolistType
} from "feature/todolist/todolists-reducer";
import { addTask, changeTaskStatus, changeTaskTitle, removeTask } from "feature/task/tasks-reducer";
import { TaskType, Todolist } from "feature/todolist/Todolist";
import { AddItemForm } from "components/AddItemForm";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "feature/store/store";


function App() {
  console.log('rerender');
  const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
  const dispatch = useDispatch();

  const removeTasks = useCallback((id: string, todoID: string) => {
    dispatch(removeTask(id, todoID));
  },[]);
  const changeTaskTitles = useCallback((taskID: string, title: string, todoID: string) => {
    dispatch(changeTaskTitle(taskID, todoID, title))
  },[]);
  const addTasks = useCallback((todoID: string, title: string) => {
    dispatch(addTask(todoID, title))
  },[]);
  const addTodos = useCallback((title: string) => {
    dispatch(addTodo(title))
  },[]);

  const changeFilter = useCallback((filter: FilterType, todoID: string) => {
    dispatch( changeTodoFilter(todoID, filter))
  },[]);
  const onChangeTaskStatus = useCallback((taskID: string, isDone: boolean, todoID: string) => {
    dispatch(changeTaskStatus(taskID, todoID, isDone))
  },[]);
  const removeTodos = useCallback((todoID: string) => {
    dispatch(removeTodo(todoID));
  },[]);
  const todoChangeTitle = useCallback((title: string, todoID: string) => {
    console.log( title );
    dispatch(changeTodoTitle( todoID, title ))
  },[]);

  return (
    <div className="App">

      <AppBar position={"static"}>
        <Toolbar>
          <IconButton edge={"start"} color={"inherit"} aria-label={"menu"}>
            <Menu />
          </IconButton>
          <Typography variant={"h5"}>
            Todolist
          </Typography>
          <Button color={"inherit"}>Login</Button>
        </Toolbar>
      </AppBar>

      <Container fixed>
        <Grid container style={{ padding: "20px" }}>
          <AddItemForm addItems={addTodos} />
        </Grid>
        <Grid container spacing={3}>
          {
            todolists.map(todo => {
              let tasksForTodo = tasks[todo.id];
              if (todo.filter === "active") {
                tasksForTodo = tasks[todo.id].filter(el => !el.isDone);
              }
              if (todo.filter === "completed") {
                tasksForTodo = tasks[todo.id].filter(el => el.isDone);
              }

              return <Grid item key={todo.id}>
                <Paper style={{ padding: " 10px " }}><Todolist
                  todoID={todo.id}
                  title={todo.title}
                  task={tasksForTodo}
                  removeTask={removeTasks}
                  changeFilter={changeFilter}
                  filter={todo.filter}
                  addTask={addTasks}
                  onChangeTaskStatus={onChangeTaskStatus}
                  removeTodo={removeTodos}
                  changeTaskTitle={changeTaskTitles}
                  todoChangeTitle={todoChangeTitle}
                /></Paper>
              </Grid>;
            })
          }
        </Grid>
      </Container>
    </div>
  );
}


export type TasksStateType = {
  [key: string]: TaskType[]
}
export default App;
