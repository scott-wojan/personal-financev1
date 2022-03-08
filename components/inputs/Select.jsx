import ChevronDown from "components/icons/ChevronDown";
import ChevronRight from "components/icons/ChevronRight";
import ChevronUp from "components/icons/ChevronUp";
import filterObject from "components/utils/filterObject";
import React, { useState } from "react";

const Option = ({
  label,
  value,
  onClick = undefined,
  options = undefined,
  currentValue = undefined,
}) => {
  const [show, setShow] = useState(false);
  const poo = currentValue === value ? " text-indigo-700" : "";

  return (
    <div>
      <div className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-200">
        <div className="flex items-center ">
          {options && !show && (
            <ChevronRight
              onClick={() => {
                setShow(!show);
              }}
            />
          )}
          {options && show && (
            <ChevronDown
              onClick={() => {
                setShow(!show);
              }}
            />
          )}
          {!options && <span className="p-1"></span>}
          <div
            className="flex items-center pl-2"
            onClick={() => {
              onClick?.({ label, value });
            }}
          >
            <p className={"ml-2 text-sm leading-normal " + poo}>{label}</p>
          </div>
        </div>
      </div>
      {show && options && (
        <div className="pl-4 ">
          {options.map((option, index) => {
            return (
              <Option
                label={option.label}
                options={option.options}
                key={index}
                value={option.value}
                onClick={onClick}
                currentValue={currentValue}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export function getLabelForValue(options, value) {
  return filterObject(options, (o) =>
    o?.value?.toString()?.match(new RegExp(value?.toString(), "i"))
  )?.[0]?.label;
}

export default function Select({
  options,
  value: initialValue = undefined,
  placeholder = undefined,
  onChange = undefined,
}) {
  const selectedLabel = getLabelForValue(options, initialValue) ?? null;
  const [label, setLabel] = useState(selectedLabel);
  const [value, setValue] = useState(initialValue);
  const [selections, setSelections] = useState(options);
  const inputRef = React.createRef();
  const [isVisible, setIsVisible] = useState(false);

  const filterOptionsByLabel = (value) => {
    return filterObject(options, (o) =>
      o?.label?.match(new RegExp(value?.toString(), "i"))
    );
  };

  const searchOptions = (value) => {
    if (value === "") {
      setSelections(options);
      return;
    }
    const filteredValues = filterOptionsByLabel(value);
    setSelections(filteredValues);
  };

  const onSelection = ({ label: newLabel, value: newValue }) => {
    if (newValue != value) onChange?.(newValue, value, label);
    setLabel(newLabel);
    setValue(newValue);
    inputRef.current.value = "";
    setSelections(options);
    setIsVisible(false);
  };

  return (
    <div className="h-6">
      <div
        onClick={() => setIsVisible(!isVisible)}
        className="flex items-center justify-between h-full text-sm font-medium leading-none bg-white rounded shadow cursor-pointer"
      >
        {label ? (
          <div>{label}</div>
        ) : (
          <div className="text-gray-400">{placeholder}</div>
        )}
        <div className="pr-2">
          {isVisible ? (
            <div>
              <ChevronUp />
            </div>
          ) : (
            <div>
              <ChevronDown />
            </div>
          )}
        </div>
      </div>
      {isVisible && (
        <div className="absolute w-64 pt-2 pb-2 overflow-scroll bg-white rounded shadow h-72">
          <div className="pb-2 pl-4 pr-4">
            <input
              placeholder="search"
              ref={inputRef}
              type="text"
              className="w-full h-full border "
              onChange={(event) => searchOptions(event.target.value)}
            />
          </div>
          {selections?.map((option, index) => {
            return (
              <Option
                key={index}
                value={option.value}
                label={option.label}
                options={option.options}
                onClick={onSelection}
                currentValue={value}
              />
            );
          })}
          <div className="p-2 text-sm pl-11">Add Category</div>
        </div>
      )}
    </div>
  );
}
