import React, { ChangeEvent, useState } from "react";

type EditableSpanPropsType = {
  title: string
  onTitleChange: (title: string) => void
};
export const EditableSpan: React.FC<EditableSpanPropsType> = ({
                                                                title,
                                                                onTitleChange
                                                              }) => {
  const [editMode, setEditMode] = useState(false);
  const [titleValue, setTitleValue] = useState('');

  const activateEditMode = () => {
    setEditMode( true )
    setTitleValue( title )
  }

  const deactivateEditMode = () => {
    setEditMode(false)
    onTitleChange( titleValue )
  }

const onChangeHandle = (e:ChangeEvent<HTMLInputElement>) => {
  console.log(e.currentTarget.value);
    setTitleValue( e.currentTarget.value )
}
  return (
    <span>
      {
        editMode
          ? <input type="text" value={titleValue} onChange={onChangeHandle} autoFocus  onBlur={deactivateEditMode}/>
          : <span onDoubleClick={activateEditMode}>{title}</span>
      }
    </span>
  );
};