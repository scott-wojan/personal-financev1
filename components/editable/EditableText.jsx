import { format } from "components/utils/formatting";
import React, { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";

export default function EditableText({
  value,
  formatting = undefined,
  onChange = undefined,
  disabled = false,
  isInEditMode = false,
}) {
  const [unFormattedValue, setUnFormattedValue] = useState(value);
  const [formattedValue, setFormattedValue] = useState(value);
  const [isEditing, setIsEditing] = useState(isInEditMode);

  useEffect(() => {
    setUnFormattedValue(value);
  }, [value]);

  useEffect(() => {
    setIsEditing(isInEditMode);
  }, [isInEditMode]);

  useEffect(() => {
    if (formatting) {
      setFormattedValue(format(formatting.type, value, formatting.settings));
    } else {
      setFormattedValue(unFormattedValue);
    }
  }, [formatting, value, unFormattedValue]);

  const onBlur = (e) => {
    const newValue = e.target.value;
    // setIsEditing(false);
    setUnFormattedValue(newValue);
    if (value !== newValue) onChange?.(newValue, value);
  };

  if (isEditing) {
    return (
      <input
        type="text"
        defaultValue={unFormattedValue?.toString() ?? ""}
        className="w-full"
        onBlur={onBlur}
      />
    );
  }

  return <div>{formattedValue?.toString()}</div>;
}
