import { Delete } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { EditableSpan } from "components/EditableSpan";
import { TaskType } from "feature/todolist/Todolist";
import React, { ChangeEvent, memo } from "react";

type TaskPropsType = {
  task: TaskType
  onClickDeleteHandler: (taskID: string ) => void
  onChangeTaskStatusHandle: (taskID: string, isDone: boolean ) => void
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
  onChangeTaskStatusHandle(task.id, e.currentTarget.checked)
}
const onTitleChangeHandler = (title: string) => {
  onTitleChange(task.id, title)
}
  return (
    <ul key={task.id}>
      <li style={task.isDone ? { opacity: "0.6", textDecoration: "line-through" } : {}}>
        <Checkbox color={"primary"} checked={task.isDone} onChange={onStatusChangeHandler} />
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
