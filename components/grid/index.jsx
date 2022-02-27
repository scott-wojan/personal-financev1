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

export default function Index({ columns, data }) {
  const [selectedRowIndex, setSelectedRowIndex] = useState("-1");

  const updateSelectedRowIndex = (rowIndex) => {
    setSelectedRowIndex((prev) => {
      if (selectedRowIndex != rowIndex) {
        setSelectedRowIndex(rowIndex);
        console.log(`Row changing from: ${selectedRowIndex} to: ${rowIndex}`);
      }
      return rowIndex;
    });
  };

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
    // state: { selectedRowIndex },
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
                onClick={(element) => {
                  updateSelectedRowIndex(row.id);

                  // if (selectedRowIndex != row.id) {
                  //   row.setState((old) => ({
                  //     ...old,
                  //     isEditing: true, //!old.isEditing
                  //   }));
                  // }
                }}
                // onBlur={() => {
                //   console.log("onBlur", selectedRowIndex, row.id);
                //   row.setState((old) => ({
                //     ...old,
                //     isEditing: false,
                //   }));
                // }}
              >
                {row.cells.map((cell, cellIndex) => {
                  return (
                    <td
                      key={cellIndex}
                      {...cell.getCellProps()}
                      onFocus={(element) => {
                        console.log(
                          `onFocus: selectedRowIndex: ${selectedRowIndex} currentRow: ${row.id}`
                        );
                        //updateSelectedRowIndex(row.id);
                      }}
                    >
                      {cell.render("Cell")}
                      {row.state.isEditing ? " yes" : " no"}
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
