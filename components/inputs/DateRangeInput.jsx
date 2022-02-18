import React, { useState } from "react";
import DateInput from "./DateInput";

export default function DateRangeInput({ onChange }) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const onInputChange = () => {
    if (startDate && endDate) {
      onChange?.(startDate, endDate);
    }
  };
  return (
    <div className="flex">
      <DateInput
        onChange={(date) => {
          setStartDate(date);
          onInputChange();
        }}
      />
      {" to "}
      <DateInput
        onChange={(date) => {
          setEndDate(date);
          onInputChange();
        }}
      />
    </div>
  );
}
