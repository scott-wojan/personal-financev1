import React, { useRef, useState } from "react";
import { useFlexLayout, useRowState, useTable } from "react-table";

const tableInitialState = {
  selectedRowIndex: undefined,
};

function getTableOptions(columns, data, initialState) {
  return {
    columns,
    data,
    initialState,
    hiddenColumns: columns
      .filter((col) => col.show === false)
      .map((col) => col.accessor),
    initialRowStateAccessor: (row) => ({ isEditing: false }),
    initialCellStateAccessor: (cell) => ({ count: 0 }),
  };
}

export default function Index({ columns, data, onChange }) {
  const [selectedRowIndex, setSelectedRowIndex] = useState("-1");

  const tableInstance = useTable(
    getTableOptions(columns, data, tableInitialState),
    useFlexLayout,
    useRowState
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: {},
  } = tableInstance;

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup, headerIndex) => (
              // Apply the header row props
              <tr key={headerIndex} {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column, columnIndex) => (
                    // Apply the header cell props
                    <th key={columnIndex} {...column.getHeaderProps()}>
                      {
                        // Render the header
                        column.render("Header")
                      }
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            // console.log(row);
            return (
              <tr
                key={rowIndex}
                {...row.getRowProps()}
                onClick={() => {
                  setSelectedRowIndex(row.id);
                }}
              >
                {row.cells.map((cell, cellIndex) => {
                  //  console.log(tableInstance.state.selectedRowIndex);
                  return (
                    <td key={cellIndex} {...cell.getCellProps()}>
                      {cell.render("Cell", {
                        isInEditMode: selectedRowIndex == row.id,
                        options: cell.column.options,
                        onChange: (newValue, oldValue) => {
                          onChange?.(
                            cell.row,
                            cell.column.id,
                            newValue,
                            oldValue
                          );
                        },
                        formatting:
                          cell.column.formatting &&
                          new Proxy(
                            {
                              ...cell.column.formatting,
                              data: cell.row.values,
                            },
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
      </table>
    </>
  );
}
