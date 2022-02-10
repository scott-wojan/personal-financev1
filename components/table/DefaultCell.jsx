import React, { useEffect, useState } from "react";
import { format } from "../utils/formatting";

export default function DefaultCell({ value, column, formatting = undefined }) {
  const [formattedValue, setFormattedValue] = useState(value);
  useEffect(() => {
    if (formatting) {
      setFormattedValue(format(formatting.type, value, formatting.settings));
      return;
    }
    if (column && column?.dataType === "date") {
      setFormattedValue(format(column?.dataType, value, formatting?.settings));
      return;
    }
    setFormattedValue(value);
  }, [column, formatting, value]);

  return <div>{formattedValue?.toString() || value?.toString() || ""}</div>;
}
