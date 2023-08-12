import React, { useState } from "react";
import "./App.css";
import { TaskType, Todolist } from "./Todolist";
import { v1 } from "uuid";
import { AddItemForm } from "./AddItemForm";
import AppBar from "@mui/material/AppBar";
import { Container, Grid, IconButton, Toolbar, Typography, Paper } from "@mui/material";
import { Menu } from "@mui/icons-material";
import Button from "@mui/material/Button";


function App() {
  let todolistID1 = v1();
  let todolistID2 = v1();

  let [todolists, setTodolists] = useState<Array<TodolistType>>([
    { id: todolistID1, title: "What to learn", filter: "all" },
    { id: todolistID2, title: "What to buy", filter: "all" }
  ]);

  let [tasks, setTasks] = useState<TasksStateType>({
    [todolistID1]: [
      { id: v1(), title: "HTML&CSS", isDone: true },
      { id: v1(), title: "JS", isDone: true },
      { id: v1(), title: "ReactJS", isDone: false }
    ],
    [todolistID2]: [
      { id: v1(), title: "Rest API", isDone: true },
      { id: v1(), title: "GraphQL", isDone: false }
    ]
  });


  const removeTask = (id: string, todoID: string) => {
    tasks[todoID] = tasks[todoID].filter(el => el.id !== id);
    setTasks({ ...tasks });
  };

  const changeFilter = (filter: FilterType, todoID: string) => {
    let todolist = todolists.find(el => el.id === todoID);
    if (todolist) {
      todolist.filter = filter;
      setTodolists([...todolists]);
    }
  };

  const addTask = (title: string, todoID: string) => {
    debugger
    const newTask = { id: v1(), title, isDone: false };
    tasks[todoID] = [newTask, ...tasks[todoID]];
    setTasks({ ...tasks });
  };

  const onChangeTaskStatus = (taskID: string, isDone: boolean, todoID: string) => {
    let task = tasks[todoID].find(el => el.id === taskID);
    if (task) {
      task.isDone = isDone;
      setTasks({ ...tasks });
    }
  };

  const removeTodo = (todoID: string) => {
    setTodolists(todolists.filter(el => el.id !== todoID));
    delete tasks[todoID];
    setTasks({ ...tasks });
  };

  const addTodo = (title: string) => {
    let newTodoID = v1();
    let newTodo: TodolistType = { id: newTodoID, title, filter: "all" };
    setTodolists([newTodo, ...todolists]);
    setTasks({ ...tasks, [newTodoID]: [] });
  };

  const changeTaskTitle = (taskID: string, title: string, todoID: string) => {
    tasks[todoID] = tasks[todoID].map(el => el.id === taskID ? { ...el, title } : el);
    setTasks({ ...tasks });
  };

  const todoChangeTitle = (title: string, todoID: string) => {
    console.log(title, ": title", " - ", todoID, ": todoID");
    todolists = todolists.map(el => el.id === todoID ? { ...el, title } : el);
    setTodolists([...todolists]);
  };

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
          <AddItemForm addItems={addTodo} />
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
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  filter={todo.filter}
                  addTask={addTask}
                  onChangeTaskStatus={onChangeTaskStatus}
                  removeTodo={removeTodo}
                  changeTaskTitle={changeTaskTitle}
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

export type FilterType = "all" | "active" | "completed"
export type TodolistType = {
  id: string
  filter: FilterType
  title: string
}
export type TasksStateType = {
  [key: string]: TaskType[]
}
export default App;
