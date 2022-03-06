import useOnClickOutside from "components/hooks/useOnClickOutside";
import { format, formattingHandler } from "components/utils/formatting";
import { getDiff } from "components/utils/getDiff";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useFlexLayout,
  useRowSelect,
  useRowState,
  useTable,
} from "react-table";

const DisplayCell = ({ value: initialValue, formatting }) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);
  const [unFormattedValue, setUnFormattedValue] = useState(value);
  const [formattedValue, setFormattedValue] = useState(value);

  useEffect(() => {
    setUnFormattedValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (formatting) {
      setFormattedValue(format(formatting.type, value, formatting.settings));
    } else {
      setFormattedValue(unFormattedValue);
    }
  }, [formatting, value, unFormattedValue]);

  return (
    <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
      {formattedValue?.toString() ?? ""}
    </p>
  );
};

const GridContext = createContext({
  selectedRow: null,
  setSelectedRow: null,
  selectedColumnIndex: null,
  setSelectedColumnIndex: null,
  tableRef: null,
  tbodyRef: null,
  expandedRowIndex: null,
  setExpandedRowIndex: null,
});

function GridProvider({ children }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(0);
  const [expandedRowIndex, setExpandedRowIndex] = useState(0);

  const tableRef = useRef();
  const tbodyRef = useRef(null);

  const memoedValue = useMemo(
    () => ({
      selectedRow,
      setSelectedRow,
      selectedColumnIndex,
      setSelectedColumnIndex,
      tableRef,
      tbodyRef,
      expandedRowIndex,
      setExpandedRowIndex,
    }),
    [selectedRow, selectedColumnIndex, expandedRowIndex]
  );

  return (
    <GridContext.Provider value={memoedValue}>{children}</GridContext.Provider>
  );
}
function useGrid() {
  return useContext(GridContext);
}

const defaultColumn = {
  Cell: DisplayCell,
};

const StyledGrid = ({
  columns,
  data,
  onCellChange = undefined,
  onRowChange = undefined,
  paginationSettings = {
    page: 0,
    pageSize: 10,
    onPageChange: undefined,
    onPageSizeChange: undefined,
  },
}) => {
  const [tableData, setTableData] = useState(data);

  const initialTableState = {};
  const initialRowState = {};

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const updateTableData = ({ row, propertyName, newValue, oldValue }) => {
    row.values[propertyName] = newValue;
    onCellChange?.({ row: row, propertyName, newValue, oldValue });
    //setSelectedRow(row);
  };

  console.log("data", data);
  const getTableOptions = ({ defaultColumn, columns, data, initialState }) => {
    return {
      columns,
      defaultColumn,
      data: data?.data ?? [],
      autoResetRowState: false,
      initialState: {
        // pageIndex: queryPageIndex,
        // pageSize: queryPageSize,
        hiddenColumns: columns
          .filter((col) => col.show === false)
          .map((col) => col.accessor),
      },
      initialRowStateAccessor: (row) => initialRowState,
      // initialCellStateAccessor: (cell) => ({ count: 0 }),
      manualPagination: true,
      pageCount: Math.ceil(data?.totalCount / paginationSettings.pageSize),
    };
  };

  const tableInstance = useTable(
    getTableOptions({
      defaultColumn,
      columns,
      data: tableData,
      initialState: initialTableState,
    }),

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

    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state: {},
  } = tableInstance;

  console.log(gotoPage, canPreviousPage);

  return (
    <div>
      <GridProvider>
        <Table {...getTableProps()}>
          <TableHeader headerGroups={headerGroups} />
          <TableBody
            {...getTableBodyProps()}
            rows={rows}
            prepareRow={prepareRow}
            onCellChange={updateTableData}
            onRowChange={onRowChange}
          />
        </Table>
        <Pagination
          {...paginationSettings}
          {...{
            //pageSize,
            setPageSize,
            gotoPage,
            canPreviousPage,
            previousPage,
            //pageIndex,
            pageOptions,
            nextPage,
            canNextPage,
            pageCount,
          }}
        />
      </GridProvider>
    </div>
  );
};
export default StyledGrid;

const Table = ({ children, ...rest }) => {
  const { tableRef } = useGrid();

  return (
    <table {...rest} ref={tableRef} className="data-grid">
      {children}
    </table>
  );
};
Table.displayName = "Table";

function TableHeader({ headerGroups }) {
  const { selectedColumnIndex, setSelectedColumnIndex } = useGrid();
  return (
    <thead>
      {headerGroups.map((headerGroup, headerIndex) => {
        return (
          <tr key={headerIndex}>
            <th className="w-1 py-3 pl-3 ">
              <div className="flex items-center">
                <p>Details</p>
              </div>
            </th>

            {headerGroup.headers.map((column, columnIndex) => {
              return (
                <th
                  {...column.getHeaderProps()}
                  key={columnIndex}
                  className="w-24 py-3 pl-3 whitespace-no-wrap cursor-pointer "
                  onClick={() => {
                    selectedColumnIndex == 0
                      ? setSelectedColumnIndex(
                          headerGroup.headers.length + columnIndex
                        )
                      : setSelectedColumnIndex(0);
                  }}
                >
                  <div className="relative flex items-center justify-between">
                    <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                      {column.render("Header")}
                    </p>

                    <ChevronDown />
                    {selectedColumnIndex ==
                      headerGroup.headers.length + columnIndex && (
                      <HeaderDropDown />
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        );
      })}
    </thead>
  );
}

const TableBody = ({
  rows,
  prepareRow,
  onCellChange,
  onRowChange,
  ...rest
}) => {
  const { tbodyRef, selectedRow, setSelectedRow } = useGrid();

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

  useOnClickOutside(tbodyRef, () => updateSelectedRow(null));

  return (
    <tbody ref={tbodyRef} {...rest}>
      {rows.length == 0 && (
        <tr>
          <td colSpan={99} className="text-sm text-center p-14">
            No results
          </td>
        </tr>
      )}
      {rows.map((row, rowIndex) => {
        prepareRow(row);
        return (
          <TableRow
            key={rowIndex}
            row={row}
            onCellChange={onCellChange}
            onActiveRowIndexChange={(newIndex) => {
              const newRow = rows.find((r) => {
                return r.index == newIndex;
              });
              if (newRow) {
                updateSelectedRow(newRow);
              }
            }}
          />
        );
      })}
    </tbody>
  );
};
TableBody.displayName = "TableBody";

function TableCell({ cell, row, onChange: onCellChange }) {
  const { selectedRow } = useGrid();
  return (
    <td {...cell.getCellProps()} className="pl-3">
      {cell.render("Cell", {
        isInEditMode: selectedRow?.index == row.index,
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

function TableRow({ row, onCellChange, onActiveRowIndexChange }) {
  const {
    selectedRow,
    setSelectedRow,
    tbodyRef,
    expandedRowIndex,
    setExpandedRowIndex,
  } = useGrid();

  return (
    <>
      <tr
        className={row.index == selectedRow?.index ? "active" : ""}
        onClick={() => {
          setSelectedRow(row);
        }}
        onKeyDown={(e) => {
          handleTableRowKeyDown(e, tbodyRef, row, onActiveRowIndexChange);
        }}
      >
        <td className="w-1 py-3 pl-3">
          <div className="flex items-center">
            <a
              onClick={() => {
                expandedRowIndex == 0
                  ? setExpandedRowIndex(row.index + 1)
                  : setExpandedRowIndex(0);
              }}
              className=""
              href="#"
            >
              {expandedRowIndex == row.index + 1 ? (
                <ChevronDown />
              ) : (
                <ChevronRight />
              )}
            </a>
          </div>
        </td>

        {row.cells.map((cell, cellIndex) => {
          return (
            <TableCell
              key={cellIndex}
              cell={cell}
              row={row}
              // selectedRow={selectedRow}
              onChange={onCellChange}
            />
          );
        })}
      </tr>
      {expandedRowIndex == row.index + 1 && <TableSubRow />}
    </>
  );
}

function TableSubRow({}) {
  return (
    <tr className="detail-row">
      <td colSpan={9}>
        <div className="flex items-stretch w-full border-b border-gray-300 dark:border-gray-200">
          <ul>
            <li className="flex items-center justify-center text-sm leading-3 tracking-normal cursor-pointer">
              <a
                className="p-3 text-gray-800 border border-transparent dark:text-gray-100 focus:outline-none hover:text-indigo-700 focus:bg-indigo-700 focus:text-white"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-grid"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <rect x={4} y={4} width={6} height={6} rx={1} />
                  <rect x={14} y={4} width={6} height={6} rx={1} />
                  <rect x={4} y={14} width={6} height={6} rx={1} />
                  <rect x={14} y={14} width={6} height={6} rx={1} />
                </svg>
              </a>
            </li>
            <li
              autoFocus
              className="flex items-center justify-center cursor-pointer"
            >
              <a
                className="p-3 text-gray-800 border border-transparent dark:text-gray-100 focus:outline-none focus:bg-indigo-700 focus:text-white"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-puzzle"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
                </svg>
              </a>
            </li>
            <li className="flex items-center justify-center text-sm leading-3 tracking-normal cursor-pointer">
              <a
                className="p-3 text-gray-800 border border-transparent dark:text-gray-100 focus:outline-none hover:text-indigo-700 focus:bg-indigo-700 focus:text-white"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-compass"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <polyline points="8 16 10 10 16 8 14 14 8 16" />
                  <circle cx={12} cy={12} r={9} />
                </svg>
              </a>
            </li>
            <li className="flex items-center justify-center text-sm leading-3 tracking-normal cursor-pointer">
              <a
                className="p-3 text-gray-800 border border-transparent dark:text-gray-100 hover:text-indigo-700 focus:bg-indigo-700 focus:text-white"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-code"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <polyline points="7 8 3 12 7 16" />
                  <polyline points="17 8 21 12 17 16" />
                  <line x1={14} y1={4} x2={10} y2={20} />
                </svg>
              </a>
            </li>
          </ul>
          <div className="w-full bg-white border-l border-gray-300 dark:bg-gray-800 dark:border-gray-200">
            <h4 className="w-full py-3 pl-10 text-sm text-gray-800 bg-gray-100 dark:text-gray-100">
              {"accountName"}
            </h4>
            <div className="px-8 py-6 bg-white dark:bg-gray-800">
              <div className="flex items-start">
                <div className="w-1/3">
                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                    Original Name
                  </p>
                  <h5 className="text-xs font-normal text-gray-800 dark:text-gray-100">
                    Jason Smith
                  </h5>
                </div>
                <div className="w-1/3">
                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                    Original Category
                  </p>
                  <h5 className="text-xs font-normal text-gray-800 dark:text-gray-100">
                    Development
                  </h5>
                </div>
                <div className="w-1/3">
                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                    Original Subcategory
                  </p>
                  <h5 className="text-xs font-normal text-gray-800 dark:text-gray-100">
                    1440 Hours, 45 Mins
                  </h5>
                </div>
              </div>
              <div className="flex items-start mt-6">
                <div className="w-1/3">
                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                    Project
                  </p>
                  <h5 className="text-xs font-normal text-gray-800 dark:text-gray-100">
                    Create new features for the app
                  </h5>
                </div>
                <div className="w-1/3">
                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                    Priority
                  </p>
                  <h5 className="text-xs font-normal text-gray-800 dark:text-gray-100">
                    High
                  </h5>
                </div>
                <div className="w-1/3">
                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                    Incharge officer(s)
                  </p>
                  <h5 className="text-xs font-normal text-indigo-700">
                    Saul Berenson &amp; Nicholas Brody
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

function HeaderDropDown() {
  return (
    <ul className="absolute top-0 right-0 w-48 py-1 mt-2 mt-8 bg-white rounded shadow dark:bg-gray-800 dropdown-content">
      <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">
        Option 1
      </li>
      <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">
        Option 2
      </li>
      <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">
        Option 3
      </li>
      <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer dark:text-gray-400 hover:bg-indigo-700 hover:text-white">
        Option 4
      </li>
    </ul>
  );
}

function ChevronDown() {
  return (
    <div className="mr-3 cursor-pointer dark:text-gray-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-chevron-down"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="mr-3 cursor-pointer dark:text-gray-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
        className="iconify iconify--tabler"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m9 6l6 6l-6 6"
        ></path>
      </svg>
    </div>
  );
}

function Pagination({
  page = 0,
  pageSize = 10,
  setPageSize,
  gotoPage,
  canPreviousPage,
  previousPage,
  pageOptions,
  nextPage,
  canNextPage,
  pageCount,
  onPageChange = undefined,
  onPageSizeChange = undefined,
}) {
  console.log(gotoPage, canPreviousPage);
  return (
    <nav aria-label="pagination" className="flex justify-between">
      <div>
        <div>
          Show{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>{" "}
          at a time.
        </div>
      </div>
      <ul className="pagination">
        <li>
          <button onClick={() => gotoPage?.(0)} disabled={!canPreviousPage}>
            <span>&laquo;</span>
          </button>
        </li>
        <li>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>
        </li>
        <span className="page">
          Page {page + 1} of {pageSize}
        </span>
        <li>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>
        </li>
        <li>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <span>&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

const handleTableRowKeyDown = (
  event,
  tbodyRef,
  row,
  onActiveRowIndexChange
) => {
  event.stopPropagation();
  const currentRow = tbodyRef.current?.children[row.index];
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
        onActiveRowIndexChange(prevRow.rowIndex - 1);
      }
      const prevRowInputs = prevRow?.querySelectorAll("input") || [];
      prevRowInputs[currentPosition] && prevRowInputs[currentPosition].focus();
      break;
    case "ArrowDown":
      const nextRow = currentRow?.nextElementSibling;
      if (nextRow) {
        onActiveRowIndexChange(nextRow.rowIndex - 1);
      }
      const nextRowInputs = nextRow?.querySelectorAll("input") || [];
      nextRowInputs[currentPosition] && nextRowInputs[currentPosition].focus();
      break;
    default:
      break;
  }
};
