import filterObject from "components/utils/filterObject";
import useVisible from "components/utils/useVisible";
import React, { useEffect, useState } from "react";

function Select({ value, options, onChange, name }) {
  console.log(`${name} render`);
  return (
    <select
      id="lang"
      className="w-full"
      onChange={onChange}
      defaultValue={value}
    >
      {options.map((cat, key) => (
        <option key={key} value={cat.text}>
          {cat.text}
        </option>
      ))}
    </select>
  );
}

function getLabelForValue(options, value) {
  return filterObject(options, (o) =>
    o?.value?.toString()?.match(new RegExp(value?.toString(), "i"))
  )?.[0]?.label;
}

export default function EditableSelect({ options, value, onChange }) {
  const [selectedOption, setSelectedOption] = useState(value);
  const [selectedLabel, setSelectedLabel] = useState("");
  const { ref, isVisible, setIsVisible } = useVisible(false);

  useEffect(() => {
    const label = getLabelForValue(options, value);
    setSelectedLabel(label);
  }, [options, value]);

  const handleTypeSelect = (newValue, oldValue) => {
    setSelectedOption(newValue);
    setSelectedLabel(getLabelForValue(options, newValue));
    onChange?.(newValue, oldValue);
  };

  return (
    <span ref={ref}>
      {!isVisible ? (
        <div onClick={() => setIsVisible(!isVisible)}>{selectedLabel}</div>
      ) : (
        <Select
          options={options}
          onChange={handleTypeSelect}
          value={selectedOption}
        />
      )}
    </span>
  );
}
