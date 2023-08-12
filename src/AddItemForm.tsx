import React, { ChangeEvent, KeyboardEvent, useState } from "react";


type AddItemFormPropsType = {
  addItems: (title: string) => void
}

export const AddItemForm: React.FC<AddItemFormPropsType> = ({
                                                              addItems
                                                            }) => {
  let [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addItem = () => {
    debugger
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
      <input
        type="text"
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        value={title}
      />
      <button onClick={addItem}>+</button>
      {error && <div> {error} </div>}
    </div>
  );

};