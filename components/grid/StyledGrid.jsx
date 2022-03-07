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

const DisplayCell = ({ value, formatting }) => {
  // We need to keep and update the state of the cell normally
  const [unFormattedValue, setUnFormattedValue] = useState(value);
  const [formattedValue, setFormattedValue] = useState(value);

  useEffect(() => {
    setUnFormattedValue(value);
  }, [value]);

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

const useGrid = () => {
  return useContext(GridContext);
};

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
    total: 0,
    onPageChange: undefined,
    onPageSizeChange: undefined,
  },
}) => {
  // const [tableData, setTableData] = useState(data);
  const initialTableState = {};
  // const initialRowState = {};

  // useEffect(() => {
  //   setTableData(data);
  // }, [data]);

  const updateTableData = ({ row, propertyName, newValue, oldValue }) => {
    row.values[propertyName] = newValue;
    onCellChange?.({ row: row, propertyName, newValue, oldValue });
  };

  const getTableOptions = ({ initialState }) => {
    return {
      columns,
      defaultColumn,
      data: data?.data ?? [],
      autoResetRowState: false,
      initialState: {
        hiddenColumns: columns
          .filter((col) => col.show === false)
          .map((col) => col.accessor),
      },
      // initialRowStateAccessor: (row) => initialRowState,
      // initialCellStateAccessor: (cell) => ({ count: 0 }),
    };
  };

  const tableInstance = useTable(
    getTableOptions({
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
    state: {},
  } = tableInstance;

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
        <Pagination {...paginationSettings} />
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
            <th className="">
              <div className="flex items-center">
                <p></p>
              </div>
            </th>

            {headerGroup.headers.map((column, columnIndex) => {
              return (
                <th
                  {...column.getHeaderProps()}
                  key={columnIndex}
                  className="px-3 py-3 whitespace-no-wrap cursor-pointer "
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
            onRowChange={updateSelectedRow}
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

function TableRow({ row, onRowChange, onCellChange, onActiveRowIndexChange }) {
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
          onRowChange(row);
        }}
        onKeyDown={(e) => {
          handleTableRowKeyDown(e, tbodyRef, row, onActiveRowIndexChange);
        }}
      >
        <td className="w-1 py-3 pl-3">
          <div className="flex items-center ">
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
                <div className="text-white">
                  <ChevronDown />
                </div>
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
  const [activeTab, setActiveTab] = useState(0);
  return (
    <tr className="detail-row">
      <td colSpan={9}>
        <div className="flex items-stretch w-full border-b border-gray-300 dark:border-gray-200">
          <ul>
            <li className="flex items-center justify-center text-sm leading-3 tracking-normal cursor-pointer">
              <a
                href="#"
                className="p-3 text-gray-800 border border-transparent dark:text-gray-100 focus:outline-none hover:text-indigo-700 focus:bg-indigo-700 focus:text-white"
                onClick={() => {
                  setActiveTab(0);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-notes"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <rect x="5" y="3" width="14" height="18" rx="2" />
                  <line x1="9" y1="7" x2="15" y2="7" />
                  <line x1="9" y1="11" x2="15" y2="11" />
                  <line x1="9" y1="15" x2="13" y2="15" />
                </svg>
              </a>
            </li>
            <li
              autoFocus
              className="flex items-center justify-center cursor-pointer"
            >
              <a
                href="#"
                className="p-3 text-gray-800 border border-transparent dark:text-gray-100 focus:outline-none focus:bg-indigo-700 focus:text-white"
                onClick={() => {
                  setActiveTab(1);
                }}
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
                href="#"
                className="p-3 text-gray-800 border border-transparent dark:text-gray-100 focus:outline-none focus:bg-indigo-700 focus:text-white"
                onClick={() => {
                  setActiveTab(2);
                }}
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
                href="#"
                className="p-3 text-gray-800 border border-transparent dark:text-gray-100 focus:outline-none focus:bg-indigo-700 focus:text-white"
                onClick={() => {
                  setActiveTab(3);
                }}
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
          {activeTab === 0 && (
            <div className="w-full bg-white border-l border-gray-300 dark:bg-gray-800 dark:border-gray-200">
              <h4 className="w-full py-3 pl-10 text-sm text-gray-800 bg-gray-100 dark:text-gray-100">
                USAA Checking (USAA Super Checking)
              </h4>
              <div className="px-8 py-6 bg-white dark:bg-gray-800">
                <div className="flex items-start">
                  <div className="w-1/2">
                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      Received As:
                    </p>

                    <table className="transaction-details-table">
                      <tbody>
                        <tr>
                          <td>Name:</td>
                          <td>
                            <a
                              href="https://www.google.com/search?q=COINBASE.COM 8889087930 ***********1D5D"
                              target="_blank"
                              rel="noreferrer"
                            >
                              COINBASE.COM 8889087930 ***********1D5D
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>Category:</td>
                          <td>Online Services</td>
                        </tr>
                        <tr>
                          <td>Sub Category:</td>
                          <td>Expense</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="w-1/2">
                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      Merchant Info:
                    </p>

                    <table className="transaction-details-table">
                      <tbody>
                        <tr>
                          <td>Name:</td>
                          <td>
                            <a
                              href="https://www.google.com/search?q=Best Buy"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Best Buy
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>Store #:</td>
                          <td>1234</td>
                        </tr>
                        <tr>
                          <td>Address:</td>
                          <td>
                            <a
                              href="https://www.google.com/maps/search/?api=1&query=6405 wexley ln the colony tx 75056"
                              target="_blank"
                              rel="noreferrer"
                            >
                              1234 Main Street, Dallas, TX 75056
                            </a>
                          </td>
                        </tr>
                        {/*
                      https://www.google.com/maps/search/?api=1&query=<lat>,<lng>
                      */}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-start mt-6">
                  <div className="w-1/2">
                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      Additional Information:
                    </p>
                    <table className="transaction-details-table">
                      <tbody>
                        <tr>
                          <td>Status:</td>
                          <td>Posted</td>
                        </tr>
                        <tr>
                          <td>Authorized On:</td>
                          <td>1234</td>
                        </tr>
                        <tr>
                          <td>Check number:</td>
                          <td>#456</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="w-1/2">
                    <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                      Notes
                    </p>
                    <textarea className="w-full text-xs font-normal text-gray-800 dark:text-gray-100"></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 1 && <div>Active tab 1</div>}
          {activeTab === 2 && <div>Active tab 2</div>}
          {activeTab === 3 && (
            <div>
              <textarea></textarea>
            </div>
          )}
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
  total = 0,
  onPageChange = undefined,
  onPageSizeChange = undefined,
}) {
  const totalPages = Math.ceil(total / pageSize);
  const canGoToNextPage = page + 1 >= totalPages;

  return (
    <nav aria-label="pagination" className="flex justify-between">
      <div>
        <div>
          Show{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange?.(Number(e.target.value));
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
          <button onClick={() => onPageChange(0)} disabled={page === 0}>
            <span>&laquo;</span>
          </button>
        </li>
        <li>
          {/* <button onClick={() => previousPage()} disabled={!canPreviousPage}> */}
          <button onClick={() => onPageChange(page - 1)} disabled={page === 0}>
            {"<"}
          </button>
        </li>
        <span className="page">
          Page {page + 1} of {totalPages}
        </span>
        <li>
          {/* <button onClick={() => nextPage()} disabled={!canNextPage}> */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={canGoToNextPage}
          >
            {">"}
          </button>
        </li>
        <li>
          <button
            onClick={() => onPageChange(totalPages - 1)}
            disabled={canGoToNextPage}
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
