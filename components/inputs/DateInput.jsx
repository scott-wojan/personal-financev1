import React from "react";

export default function DateInput({ onChange }) {
  return (
    <input
      type="date"
      placeholder="Start Date"
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
      className="text-xs h-7"
    />
  );
}
