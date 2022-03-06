import useOnClickOutside from "components/hooks/useOnClickOutside";
import { formattingHandler } from "components/utils/formatting";
import { getDiff } from "components/utils/getDiff";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useFlexLayout,
  useRowSelect,
  useRowState,
  useTable,
} from "react-table";

const initialTableState = {};
const initialRowState = {};

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
    if (selectedRow?.id == row?.id) {
      return; //row didn't change
    }

    if (selectedRow) {
      const changes = getDiff(selectedRow.original, selectedRow.values);

      if (Object.keys(changes).length !== 0) {
        onRowChange?.({ row: selectedRow, changes });
        selectedRow.original = { ...selectedRow.original, ...changes };
      }
    }
    setSelectedRow(row);
  };

  const updateTableData = ({ row, propertyName, newValue, oldValue }) => {
    row.values[propertyName] = newValue;
    onCellChange?.({ row: row, propertyName, newValue, oldValue });
    setSelectedRow(row);
  };

  const tableRef = useRef(null);
  const tbodyRef = useRef(null);

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
          {headerGroups.map((headerGroup, headerIndex) => (
            <tr key={headerIndex} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, columnIndex) => (
                <th key={columnIndex} {...column.getHeaderProps()}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} ref={tbodyRef}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <TableRow
                key={rowIndex}
                tbodyRef={tbodyRef}
                row={row}
                selectedRow={selectedRow}
                onClick={updateSelectedRow}
                onRowIndexChange={(newIndex) => {
                  const newRow = rows.find((r) => {
                    return r.index == newIndex;
                  });
                  if (newRow) {
                    updateSelectedRow(newRow);
                  }
                }}
              >
                {row.cells.map((cell, cellIndex) => {
                  return (
                    <TableData
                      key={cellIndex}
                      cell={cell}
                      row={row}
                      selectedRow={selectedRow}
                      onChange={updateTableData}
                    />
                  );
                })}
              </TableRow>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function TableRow({
  tbodyRef,
  row,
  selectedRow,
  onRowIndexChange,
  children,
  onClick: OnRowClick,
}) {
  return (
    <tr
      className={row.id == selectedRow?.id ? "active" : ""}
      {...row.getRowProps()}
      onClick={() => {
        OnRowClick(row);
      }}
      onKeyDown={(e) =>
        handleTableRowKeyDown(e, tbodyRef, row, onRowIndexChange)
      }
    >
      {children}
    </tr>
  );
}

const handleTableRowKeyDown = (event, tbodyRef, row, onRowIndexChange) => {
  event.stopPropagation();
  const currentRow = tbodyRef.current?.children[row.id];
  const rowInputs =
    Array.from(event.currentTarget.querySelectorAll("input")) || [];
  const currentPosition = rowInputs.indexOf(event.target);

  switch (event.key) {
    case "ArrowRight":
      rowInputs[currentPosition + 1] && rowInputs[currentPosition + 1].focus();
      break;
    case "ArrowLeft":
      rowInputs[currentPosition - 1] && rowInputs[currentPosition - 1].focus();
      break;
    case "ArrowUp":
      const prevRow = currentRow?.previousElementSibling;
      if (prevRow) {
        onRowIndexChange(prevRow.rowIndex - 1);
      }
      const prevRowInputs = prevRow?.querySelectorAll("input") || [];
      prevRowInputs[currentPosition] && prevRowInputs[currentPosition].focus();
      break;
    case "ArrowDown":
      const nextRow = currentRow?.nextElementSibling;
      if (nextRow) {
        onRowIndexChange(nextRow.rowIndex - 1);
      }
      const nextRowInputs = nextRow?.querySelectorAll("input") || [];
      nextRowInputs[currentPosition] && nextRowInputs[currentPosition].focus();
      break;
    default:
      break;
  }
};

// const findReactComponent = function (el) {
//   for (const key in el) {
//     console.log(key);
//     if (key.startsWith("__reactInternalInstance$")) {
//       const fiberNode = el[key];

//       return fiberNode && fiberNode.return && fiberNode.return.stateNode;
//     }
//   }
//   return null;
// };

function TableData({ cell, row, selectedRow, onChange: onCellChange }) {
  return (
    <td {...cell.getCellProps()}>
      {cell.render("Cell", {
        isInEditMode: selectedRow?.id == row.id,
        options: cell.column.options,
        onChange: async (newValue, oldValue) => {
          onCellChange?.({
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
}
