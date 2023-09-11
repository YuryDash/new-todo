import React, {ChangeEvent, FC} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {EditableSpan} from "common/components";
import {TaskStatuses} from "common/enums";
import {TaskType} from "features/todolists-list/todolists/todolist/api/todolists.api";
import {useActions} from "common/hooks";
import {tasksThunks} from "features/todolists-list/tasks/model/tasks.reducer";

type Props = {
  task: TaskType;
  todolistId: string;
};

export const Task: FC<Props> = React.memo(({
                                             task,
                                             todolistId
                                           }) => {
  const {removeTask, updateTask} = useActions(tasksThunks)

  const removeTaskHandler = () => removeTask({taskId: task.id, todolistId})

  const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) =>  updateTask({
      taskId: task.id,
      domainModel: {status: (e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)},
      todolistId
    })



  const changeTitleHandler = (title: string) => {
    updateTask({taskId:task.id,
    domainModel:{
     title
    }, todolistId})
  }

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={changeStatusHandler}/>

      <EditableSpan value={task.title} onChange={changeTitleHandler}/>
      <IconButton onClick={removeTaskHandler}>
        <Delete/>
      </IconButton>
    </div>
  );
});
