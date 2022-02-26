import React from "react";
import EditableSelect from "./EditableSelect";
// import EditableDate from "./EditableDate";
import EditableText from "./EditableText";

export const editableComponents = new Map([
  ["number", EditableText],
  ["text", EditableText],
  ["select", EditableSelect],
  // ["date", EditableDate],
]);

function getEditableComponentForType(type, props) {
  const component = editableComponents.get(type);
  if (!component) {
    throw new Error(`Invalid editable type '${type}'`);
  }
  const Component = React.createElement(component, props);
  return Component;
}
export { getEditableComponentForType };

export default function Editable({
  type,
  value,
  onChange,
  formatting = undefined,
  options = [],
  disabled = false,
}) {
  const Editor = () => {
    const changeHandler = (newValue, value) => {
      if (onChange) {
        onChange(newValue, value);
      }
    };

    return (
      <>
        {getEditableComponentForType(type, {
          value,
          onChange: changeHandler,
          disabled,
          options,
          formatting,
        })}
      </>
    );
  };

  return <Editor />;
}
