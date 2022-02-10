import Icon from "components/Icon";
import React, { useState, useEffect } from "react";
import filterObject from "components/utils/filterObject";
import Menu from "components/navigation/Menu";

export default function Dropdown({ value = "", options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const filterOptions = (value) => {
    return filterObject(options, (o) =>
      o?.title?.match(new RegExp(value?.toString(), "i"))
    );
  };

  const onSearch = (e) => {
    const val = e.target.value;
    setNewValue(val);
    console.log("onSearch", val);
    setIsOpen(true);

    if (val) {
      setFilteredOptions(filterOptions(val));
    } else {
      setFilteredOptions(options);
    }
  };

  const onMenuItemSelection = (item) => {
    setNewValue(item.title);
    setIsOpen(false);
    onChange?.(item);
    setFilteredOptions(options);
  };

  useEffect(() => {
    setNewValue(value);
  }, [value]);

  return (
    <div className="relative ">
      <span className="" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex flex-row items-center">
          <div className="flex flex-col ">
            <div className="relative">
              <div
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                className="absolute right-0 flex items-center h-full pr-3 cursor-pointer "
              >
                {isOpen ? (
                  <Icon name="chevron-up-outline" />
                ) : (
                  <Icon name="chevron-down-outline" />
                )}
              </div>
              <input
                type="text"
                className=""
                value={newValue ?? ""}
                onChange={onSearch}
              />
            </div>
          </div>
        </div>
      </span>
      {isOpen && (
        <Menu
          orientation="vertical"
          className="absolute"
          menuItems={filteredOptions}
          onClick={onMenuItemSelection}
        />
      )}
    </div>
  );
}
