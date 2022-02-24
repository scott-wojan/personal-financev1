import React from "react";

export function Body({ getTableBodyProps, page, prepareRow, onChange }) {
  return (
    <tbody {...getTableBodyProps()}>
      {page?.map((row, rowIndex) => {
        prepareRow(row);
        return (
          <tr key={rowIndex} {...row.getRowProps()}>
            {row.cells.map((cell, columnId) => {
              // if (cell.column.Header === "Category") {
              //   console.log(cell, columnId);
              // }
              return (
                <td key={columnId} {...cell.getCellProps()}>
                  {cell.render("Cell", {
                    onChange: (newValue, oldValue) => {
                      onChange?.(cell.row, cell.column.id, newValue, oldValue);
                    },
                    options: cell.column.options,
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

const formattingHandler = {
  get: function (target, prop, receiver) {
    if (prop === "settings") {
      const settings = Object.keys(target.settings).map((propertyName) => {
        const propertyValue = target.settings[propertyName];
        if (typeof propertyValue === "function") {
          return {
            [propertyName]: propertyValue(target.data),
          };
        }
        return {
          [propertyName]: propertyValue,
        };
      })?.[0];

      return settings;
    }
    1;
    // @ts-ignore
    return Reflect.get(...arguments);
  },
};
