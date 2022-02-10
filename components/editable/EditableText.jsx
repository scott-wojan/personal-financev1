import { format } from "components/utils/formatting";
import React, { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";

export default function EditableText({
  value,
  onChange = undefined,
  disabled = false,
  formatting = undefined,
}) {
  const [unFormattedValue, setUnFormattedValue] = useState(value);
  const [formattedValue, setFormattedValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    setUnFormattedValue(value);
  }, [value]);

  useEffect(() => {
    if (formatting) {
      setFormattedValue(format(formatting.type, value, formatting.settings));
    } else {
      setFormattedValue(unFormattedValue);
    }
  }, [formatting, value, unFormattedValue]);

  const onBlur = (e) => {
    const newValue = e.target.innerHTML;
    setIsEditing(false);
    setUnFormattedValue(newValue);

    if (value !== newValue) onChange?.(newValue, value);
  };

  return (
    <ContentEditable
      onFocus={() => {
        setIsEditing(true);
      }}
      html={
        (isEditing && unFormattedValue?.toString()) ||
        formattedValue?.toString() ||
        ""
      }
      onChange={null}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
}
