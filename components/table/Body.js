import { formattingHandler } from "components/utils/formatting";
import React from "react";

export function Body({ getTableBodyProps, page, prepareRow, onChange }) {
  return (
    <tbody {...getTableBodyProps()}>
      {page?.map((row, rowIndex) => {
        prepareRow(row);
        return (
          <tr key={rowIndex} {...row.getRowProps()}>
            {row.cells.map((cell, columnId) => {
              return (
                <td key={columnId} {...cell.getCellProps()}>
                  {cell.render("Cell", {
                    options: cell.column.options,
                    onChange: (newValue, oldValue) => {
                      onChange?.(cell.row, cell.column.id, newValue, oldValue);
                    },
                    formatting:
                      cell.column.formatting &&
                      new Proxy(
                        { ...cell.column.formatting, data: cell.row.values },
                        formattingHandler
                      ),
                  })}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
