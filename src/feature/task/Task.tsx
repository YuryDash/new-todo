import { Delete } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { EditableSpan } from "components/EditableSpan";
import React, { ChangeEvent, memo } from "react";
import { TaskStatuses, TaskType } from "api/todolist-api";

type TaskPropsType = {
  task: TaskType
  onClickDeleteHandler: (taskID: string ) => void
  onChangeTaskStatusHandle: (taskID: string, status: TaskStatuses ) => void
  onTitleChange: (taskID: string, title: string) => void
}

export const Task: React.FC<TaskPropsType> = memo(({
                                                task,
                                                onClickDeleteHandler,
                                                onChangeTaskStatusHandle,
                                                onTitleChange
                                              }) => {
  console.log('Task called');
const onStatusChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
  const taskStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
  onChangeTaskStatusHandle(task.id, taskStatus)
  console.log(e.currentTarget.checked, 'This is value of currentTarget');
  console.log(taskStatus, 'This is value taskStatus-converter(should be change)');
}
const onTitleChangeHandler = (title: string) => {
  onTitleChange(task.id, title)
}
  return (
    <ul key={task.id}>
      <li style={task.status === TaskStatuses.Completed ? { opacity: "0.6", textDecoration: "line-through" } : {}}>
        <Checkbox color={"primary"} checked={
          task.status === TaskStatuses.Completed
        } onChange={onStatusChangeHandler} />
        <EditableSpan title={task.title} onTitleChange={onTitleChangeHandler} />
        <IconButton onClick={()=> onClickDeleteHandler(task.id)}>
          <Tooltip title="Удалить задачу">
            <Delete />
          </Tooltip>
        </IconButton>
      </li>
    </ul>
  );
});
