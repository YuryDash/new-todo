import React, { useState } from "react";
import "./App.css";
import { TaskType, Todolist } from "./Todolist";
import { v1 } from "uuid";

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
    setTodolists(todolists.filter( el => el.id !== todoID))
    delete tasks[todoID]
    setTasks({...tasks})
  };

  return (
    <div className="App">
      {
        todolists.map(todo => {
          let tasksForTodo = tasks[todo.id];
          if (todo.filter === "active") {
            tasksForTodo = tasks[todo.id].filter(el => !el.isDone);
          }
          if (todo.filter === "completed") {
            tasksForTodo = tasks[todo.id].filter(el => el.isDone);
          }

          return <Todolist
            key={todo.id}
            todoID={todo.id}
            title={"yo man"}
            task={tasksForTodo}
            removeTask={removeTask}
            changeFilter={changeFilter}
            addTask={addTask}
            onChangeTaskStatus={onChangeTaskStatus}
            removeTodo={removeTodo}
          />;
        })
      }
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
  [key: string] : TaskType[]
}
export default App;
