import React from 'react';

type TodolistPropsType = {
  title: string
  task: TaskType[]
}

type TaskType = {
  id: string
  title: string
  isDone: boolean
}
export const Todolist:React.FC<TodolistPropsType> = ({
  title,
                                  }) => {
  return (
    <div>
      <div>
        <h3>{title}</h3>
        <div>
          <input/>
          <button>+</button>
        </div>
        <ul>
          <li><input type="checkbox" checked={true}/> <span>HTML&CSS</span></li>
          <li><input type="checkbox" checked={true}/> <span>JS</span></li>
          <li><input type="checkbox" checked={false}/> <span>React</span></li>
        </ul>
        <div>
          <button>All</button>
          <button>Active</button>
          <button>Completed</button>
        </div>
      </div>
    </div>
  );
};