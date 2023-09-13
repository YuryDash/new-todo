import React, {FC, useCallback, useEffect} from "react";
import {useActions} from "common/hooks";
import {AddItemForm} from "common/components";
import {tasksThunks} from "features/todolists-list/tasks/model/tasks.reducer";
import {TodolistDomainType} from "features/todolists-list/todolists/todolist/model/todolists.reducer";
import {
  FilterTasksButtons
} from "features/todolists-list/todolists/todolist/ui/filter-tasks-buttons/FilterTasksButtons";
import {Tasks} from "features/todolists-list/tasks/ui/Tasks";
import {TodolistTitle} from "./todolist-title/Todolist-title";
import {TaskType} from "features/todolists-list/tasks/api/tasks.api";

type Props = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};

export const Todolist: FC<Props> = React.memo(function ({
                                                          todolist,
                                                          tasks,
                                                        }) {
  const {fetchTasks, addTask} = useActions(tasksThunks);

  useEffect(() => {
    fetchTasks( todolist.id);
  }, [todolist.id]);

  const addTaskCallback = useCallback(
    (title: string) => {
      addTask({title, todolistId: todolist.id});
    },
    [todolist.id],
  );



  return (
    <div>
      <TodolistTitle todolist={todolist}/>
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"}/>
      <div>
        <Tasks tasks={tasks} todolist={todolist}/>
      </div>
      <div style={{paddingTop: "10px"}}>
        <FilterTasksButtons todolist={todolist}/>
      </div>
    </div>
  );
});
