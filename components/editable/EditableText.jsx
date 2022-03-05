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
  const debouncedUnFormattedValue = useDebounce(unFormattedValue, 500);

  useEffect(
    () => {
      if (debouncedUnFormattedValue && value !== debouncedUnFormattedValue) {
        onChange?.(debouncedUnFormattedValue, value);
      }
    },
    [debouncedUnFormattedValue] // Only call effect if debounced search term changes
  );

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

  const onInputChange = (e) => {
    const newValue = e.target.value;
    // console.log("onBlur", value, newValue, onChange);
    // setIsEditing(false);
    setUnFormattedValue(newValue);
    // if (value !== newValue) onChange?.(newValue, value);
  };

  return (
    <input
      type="text"
      defaultValue={unFormattedValue?.toString() ?? ""}
      className="w-full p-0 border-0 "
      onChange={onInputChange}
    />
  );

  if (isEditing) {
    return (
      <input
        type="text"
        defaultValue={unFormattedValue?.toString() ?? ""}
        className="w-full p-0 border-0"
        onChange={onInputChange}
      />
    );
  }

  return <div>{formattedValue?.toString()}</div>;
}
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
