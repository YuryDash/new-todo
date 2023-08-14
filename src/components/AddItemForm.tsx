import Button from "@mui/material/Button";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { TextField } from "@mui/material";


type AddItemFormPropsType = {
  addItems: (title: string) => void
}

export const AddItemForm: React.FC<AddItemFormPropsType> = ({
                                                              addItems
                                                            }) => {
  let [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addItem = () => {
    if (title.trim() !== "") {
      addItems(title);
      setTitle("");
    } else {
      setError("Title is required");
    }
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.key === "Enter") {
      addItem();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <TextField
          error={!!error}
          onChange={onChangeHandler}
          onKeyDown={onKeyDownHandler}
          value={title}
          label={'Title'}
          helperText={error}
        />
        <Button onClick={addItem}
                variant={"contained"}
                color={error? 'error' : 'primary'}
                style={{ maxWidth: "30px", maxHeight: "30px", minWidth: "30px", minHeight: "30px", marginLeft: "5px" }}>
          +
        </Button>
      </div>
    </div>
  );

};