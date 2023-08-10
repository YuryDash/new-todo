import React, { useState } from "react";
import "./App.css";
import { Todolist } from "./Todolist";

function App() {
  const [tasks, setTasks] = useState([
      { id: "1", title: "HTML&CSS", isDone: true },
      { id: "2", title: "JS", isDone: true },
      { id: "3", title: "ReactJS", isDone: false }
    ]
  );
  const [filter, setFilter] = useState<FilterType>('all')


  const removeTask = (id: string) => {
    setTasks(tasks.filter(el => el.id !== id));
  };
  const changeFilter = (filter: FilterType) => {
    setFilter(filter)
  }

let tasksForTodo = tasks;
  if (filter === 'active'){
    tasksForTodo = tasks.filter( el => !el.isDone )
  }
  if ( filter === 'completed' ) {
    tasksForTodo = tasks.filter( el => el.isDone )
  }

  return (
    <div className="App">
      <Todolist
        title={"yo man"}
        task={tasksForTodo}
        removeTask={removeTask}
        changeFilter={changeFilter}
      />
    </div>
  );
}
export type FilterType = 'all' | 'active' | 'completed'
export default App;
