import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";

export default function CategoriesDropdown({
  options,
  value,
  onChange = undefined,
}) {
  const [newValue, setNewValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const onSelect = (option) => {
    console.log("option", option);
    setNewValue(option.title);
    setIsEditing(false);
    onChange?.(option, value);
  };

  useEffect(() => {
    setNewValue(value);
  }, [value]);

  if (!isEditing) {
    return (
      <div
        className="w-full"
        onClick={() => {
          setIsEditing(!isEditing);
        }}
      >
        {newValue}
      </div>
    );
  }
  return <Dropdown value={newValue} options={options} onChange={onSelect} />;
}
