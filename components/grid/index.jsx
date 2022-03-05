import useOnClickOutside from "components/hooks/useOnClickOutside";
import { formattingHandler } from "components/utils/formatting";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useFlexLayout,
  useRowSelect,
  useRowState,
  useTable,
} from "react-table";

const initialTableState = {};
const initialRowState = {
  editedProperties: new Set(),
};

function getTableOptions(columns, data, initialState) {
  return {
    columns,
    data: data.data,
    autoResetRowState: false,
    initialState,
    hiddenColumns: columns
      .filter((col) => col.show === false)
      .map((col) => col.accessor),
    initialRowStateAccessor: (row) => initialRowState,
    // initialCellStateAccessor: (cell) => ({ count: 0 }),
  };
}

export default function Grid({
  columns,
  data,
  onCellChange = undefined,
  onRowChange = undefined,
}) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const updateSelectedRow = (row) => {
    if (!selectedRow?.id == row?.id) {
      return;
    }

    if (selectedRow) {
      const changes = findVariantsElement(
        selectedRow.original,
        selectedRow.values
      );

      if (Object.keys(changes).length !== 0) {
        onRowChange?.({ row: selectedRow, changes });
      }
    }
    setSelectedRow(row);

    // setSelectedRow((prevRow) => {
    //   if (prevRow) {
    //     if (prevRow.state?.editedProperties.size > 0) {
    //       const changes = {};
    //       for (let item of prevRow.state?.editedProperties) {
    //         changes[item] = "X";
    //         console.log("item", item);
    //       }
    //       onRowChange?.({ row: prevRow, changes });
    //     }
    //     // if (prevRow?.setState) await prevRow?.setState(initialRowState);
    //   }
    //   return row;
    // });
  };

  const updateTableData = ({ row, propertyName, newValue, oldValue }) => {
    //console.log("updateTableData", row, propertyName, newValue, oldValue);
    row.values[propertyName] = newValue;
    setSelectedRow(row);

    // setTableData((prev) => {
    //   const newTableData = {
    //     total: prev.total,
    //     data: prev?.data?.map((item, index) => {
    //       if (item.id === row.original.id) {
    //         const newRow = {
    //           ...item,
    //           [propertyName]: newValue,
    //         };

    //         setSelectedRow(row);

    //         onCellChange?.({ row: newRow, propertyName, newValue, oldValue });
    //         return newRow;
    //       }
    //       return item;
    //     }),
    //   };
    //   // console.log("updateTableData", newTableData);
    //   return newTableData;
    // });
  };

  const tableRef = useRef(null);
  useOnClickOutside(tableRef, () => updateSelectedRow(null)); //TODO: include in updateSelectedRowIndex
  const tableInstance = useTable(
    getTableOptions(columns, tableData, initialTableState),
    useFlexLayout,
    useRowState,
    useRowSelect
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
      <table {...getTableProps()} ref={tableRef}>
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
            return (
              <tr
                key={rowIndex}
                {...row.getRowProps()}
                onClick={() => {
                  updateSelectedRow(row);
                }}
              >
                {row.cells.map((cell, cellIndex) => {
                  return (
                    <td key={cellIndex} {...cell.getCellProps()}>
                      {cell.render("Cell", {
                        isInEditMode: selectedRow?.id == row.id,
                        options: cell.column.options,
                        onChange: async (newValue, oldValue) => {
                          await row.setState((old) => {
                            const newEdited = old.editedProperties.add(
                              cell.column.id
                            );

                            return {
                              ...old,
                              editedProperties: newEdited,
                            };
                          });

                          updateTableData?.({
                            row: row,
                            propertyName: cell.column.id,
                            newValue,
                            oldValue,
                          });
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
const findVariantsElement = (main, compareWith) => {
  const result = {};
  Object.keys(main).forEach((r) => {
    const element = main[r];
    if (compareWith[r]) {
      if (element !== compareWith[r]) {
        result[r] = compareWith[r];
      }
    }
  });
  return result;
};
