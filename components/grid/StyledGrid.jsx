import { formattingHandler } from "components/utils/formatting";
import React, { forwardRef, useMemo, useRef, useState } from "react";
import {
  useFlexLayout,
  useRowSelect,
  useRowState,
  useTable,
} from "react-table";

const DisplayCell = ({ value: initialValue }) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
      {value ?? ""}
    </p>
  );
};

const defaultColumn = {
  Cell: DisplayCell,
};

const StyledGrid = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Project",
        accessor: "project",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          const color = value === "Assigned" ? "green" : "blue";
          return (
            <div
              className={`flex items-center justify-center w-20 h-6 bg-${color}-200 rounded-md`}
            >
              <span className={`text-xs font-normal text-${color}-500`}>
                {value}
              </span>
            </div>
          );
        },
      },
      {
        Header: "Priority",
        accessor: "priority",
      },
      {
        Header: "Owner",
        accessor: "owner",
      },
      {
        Header: "Created On",
        accessor: "createdOn",
      },
      {
        Header: "Due On",
        accessor: "dueOn",
      },
      {
        Header: "Actions",
        accessor: "actions",
      },
    ],
    []
  );

  const data = {
    total: "137",
    data: [
      {
        project: "Software Developer",
        type: "Development",
        status: "Assigned",
        priority: "High",
        owner: "Jason Smith",
        createdOn: "6/28/2020",
        dueOn: "9/28/2020",
      },
      {
        project: "Jade's website",
        type: "Design",
        status: "Pending",
        priority: "Medium",
        owner: "Jason Smith",
        createdOn: "6/28/2020",
        dueOn: "9/28/2020",
      },
    ],
  };

  const [dropdownStatus, setDropdownStatus] = useState(0);
  const [tableData, setTableData] = useState(data);
  const tableRef = useRef(null);
  const tbodyRef = useRef(null);

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
    state: {},
  } = tableInstance;

  return (
    <div>
      <table
        ref={tableRef}
        className="min-w-full bg-white border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-200"
      >
        <TableHeader
          dropdownStatus={dropdownStatus}
          setDropdownStatus={setDropdownStatus}
          headerGroups={headerGroups}
        />
        <TableBody
          {...getTableBodyProps()}
          ref={tbodyRef}
          rows={rows}
          prepareRow={prepareRow}
          // @ts-ignore
          dropdownStatus={dropdownStatus}
          setDropdownStatus={setDropdownStatus}
        />
      </table>

      <Pagination />
    </div>
  );
};
export default StyledGrid;

const initialTableState = {};
const initialRowState = {};

function getTableOptions({ defaultColumn, columns, data, initialState }) {
  return {
    columns,
    defaultColumn,
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

function TableHeader({ headerGroups, dropdownStatus, setDropdownStatus }) {
  return (
    <thead>
      {headerGroups.map((headerGroup, headerIndex) => {
        return (
          <tr
            key={headerIndex}
            className="w-full bg-gray-100 border-b border-gray-300 dark:border-gray-200"
          >
            <th className="w-24 py-3 pl-3">
              <div className="flex items-center">
                <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                  Details
                </p>
              </div>
            </th>

            {headerGroup.headers.map((column, columnIndex) => {
              return (
                <th
                  {...column.getHeaderProps()}
                  key={columnIndex}
                  className="w-24 py-3 pl-3 whitespace-no-wrap cursor-pointer first-dropdown"
                  onClick={() => {
                    dropdownStatus == 0
                      ? setDropdownStatus(
                          headerGroup.headers.length + columnIndex
                        )
                      : setDropdownStatus(0);
                  }}
                >
                  <div className="relative flex items-center justify-between">
                    <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                      {column.render("Header")}
                    </p>
                    <ChevronDown />
                    {dropdownStatus ==
                      headerGroup.headers.length + columnIndex && (
                      <HeaderDropDown />
                    )}
                  </div>
                </th>
              );
            })}
            {/* <th
              className="w-32 whitespace-no-wrap cursor-pointer first-dropdown"
              onClick={() => {
                dropdownStatus == 0
                  ? setDropdownStatus(8)
                  : setDropdownStatus(0);
              }}
            >
              <div className="relative flex items-center justify-between">
                <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                  Project
                </p>
                <ChevronDown />
                {dropdownStatus == 8 && <HeaderDropDown />}
              </div>
            </th>

            <th
              onClick={() => {
                dropdownStatus == 0
                  ? setDropdownStatus(9)
                  : setDropdownStatus(0);
              }}
              className="w-32 pl-4 whitespace-no-wrap border-l border-gray-300 cursor-pointer dark:border-gray-200 first-dropdown"
            >
              <div className="relative flex items-center justify-between">
                <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                  Type
                </p>
                <ChevronDown />
                {dropdownStatus == 9 && <HeaderDropDown />}
              </div>
            </th>

            <th
              onClick={() => {
                dropdownStatus == 0
                  ? setDropdownStatus(10)
                  : setDropdownStatus(0);
              }}
              className="w-32 pl-4 whitespace-no-wrap border-l border-gray-300 cursor-pointer dark:border-gray-200 first-dropdown"
            >
              <div className="relative flex items-center justify-between">
                <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                  Status
                </p>
                <ChevronDown />
                {dropdownStatus == 10 && <HeaderDropDown />}
              </div>
            </th>

            <th
              onClick={() => {
                dropdownStatus == 0
                  ? setDropdownStatus(11)
                  : setDropdownStatus(0);
              }}
              className="w-32 pl-4 whitespace-no-wrap border-l border-gray-300 cursor-pointer dark:border-gray-200 first-dropdown"
            >
              <div className="relative flex items-center justify-between">
                <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                  Priority
                </p>
                <ChevronDown />
                {dropdownStatus == 11 && <HeaderDropDown />}
              </div>
            </th>

            <th
              onClick={() => {
                dropdownStatus == 0
                  ? setDropdownStatus(12)
                  : setDropdownStatus(0);
              }}
              className="w-32 pl-4 whitespace-no-wrap border-l border-gray-300 cursor-pointer dark:border-gray-200 first-dropdown"
            >
              <div className="relative flex items-center justify-between">
                <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                  Owner
                </p>
                <ChevronDown />
                {dropdownStatus == 12 && <HeaderDropDown />}
              </div>
            </th>

            <th
              onClick={() => {
                dropdownStatus == 0
                  ? setDropdownStatus(13)
                  : setDropdownStatus(0);
              }}
              className="w-32 pl-4 whitespace-no-wrap border-l border-gray-300 cursor-pointer dark:border-gray-200 first-dropdown"
            >
              <div className="relative flex items-center justify-between ">
                <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                  Created on
                </p>
                <ChevronDown />
                {dropdownStatus == 13 && <HeaderDropDown />}
              </div>
            </th>

            <th
              onClick={() => {
                dropdownStatus == 0
                  ? setDropdownStatus(14)
                  : setDropdownStatus(0);
              }}
              className="w-32 pl-4 whitespace-no-wrap border-l border-gray-300 cursor-pointer dark:border-gray-200 first-dropdown"
            >
              <div className="relative flex items-center justify-between ">
                <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                  Due on
                </p>
                <ChevronDown />
                {dropdownStatus == 14 && <HeaderDropDown />}
              </div>
            </th>

            <th className="w-32 pl-4 pr-12 whitespace-no-wrap border-l border-gray-300 dark:border-gray-200">
              <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                Actions
              </p>
            </th> */}
          </tr>
        );
      })}
    </thead>
  );
}

const TableBody = forwardRef((props, ref) => {
  // @ts-ignore
  const { dropdownStatus, setDropdownStatus, rows, prepareRow, ...rest } =
    props;

  return (
    <tbody ref={ref} {...rest}>
      {rows.map((row, rowIndex) => {
        prepareRow(row);
        return (
          <TableRow
            key={rowIndex}
            row={row}
            dropdownStatus={dropdownStatus}
            setDropdownStatus={setDropdownStatus}
          />
        );
      })}
    </tbody>
  );
});
TableBody.displayName = "TableBody";

function TableCell({ cell, row, selectedRow, onChange: onCellChange }) {
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

function TableRow({ row, dropdownStatus, setDropdownStatus }) {
  return (
    <>
      <tr className="border-b border-gray-300 dark:border-gray-200">
        <td className="w-24 py-3 pl-3">
          <div className="flex items-center">
            <a
              onClick={() => {
                dropdownStatus == 0
                  ? setDropdownStatus(row.index + 1)
                  : setDropdownStatus(0);

                // dropdownStatus == row.index
                // ? setDropdownStatus(
                //     headerGroup.headers.length + row.index
                //   )
                // : setDropdownStatus(0);
              }}
              className="ml-2 mr-2 text-gray-800 border border-transparent rounded cursor-pointer focus:outline-none dark:text-gray-100 lg:ml-4 sm:mr-0"
              href="#"
            >
              <ChevronDown />
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
              // onChange={updateTableData}
            />
          );
        })}
      </tr>
      {dropdownStatus == row.index + 1 && <TableSubRow />}
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
              Software Development Project
            </h4>
            <div className="px-8 py-6 bg-white dark:bg-gray-800">
              <div className="flex items-start">
                <div className="w-1/3">
                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                    Owner
                  </p>
                  <h5 className="text-xs font-normal text-gray-800 dark:text-gray-100">
                    Jason Smith
                  </h5>
                </div>
                <div className="w-1/3">
                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                    Type
                  </p>
                  <h5 className="text-xs font-normal text-gray-800 dark:text-gray-100">
                    Development
                  </h5>
                </div>
                <div className="w-1/3">
                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                    Time Spent
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
    <div className="mr-3 text-gray-800 cursor-pointer dark:text-gray-100">
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

function Pagination({}) {
  return (
    <div className="container flex items-center justify-center pt-8 mx-auto sm:justify-end">
      <a
        className="mr-5 text-gray-600 border border-gray-200 rounded dark:text-gray-400 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray"
        href="#"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-chevron-left"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="15 6 9 12 15 18" />
        </svg>
      </a>
      <p className="text-xs text-gray-800 dark:text-gray-100 fot-normal">
        Page
      </p>
      <label htmlFor="selectedPage" className="hidden" />
      <input
        id="selectedPage"
        type="text"
        className="flex items-center w-6 px-2 mx-2 text-xs font-normal text-gray-800 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:border focus:border-indigo-700 dark:border-gray-200"
        defaultValue={4}
      />
      <p className="text-xs text-gray-800 dark:text-gray-100 fot-normal">
        of 20
      </p>
      <a
        className="mx-5 text-gray-600 border border-gray-200 rounded dark:text-gray-400 focus:outline-none focus:border-gray-800 focus:shadow-outline-gray"
        href="#"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-chevron-right"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </a>
      <label htmlFor="selectedPage1" className="hidden" />
      <input
        id="selectedPage1"
        type="text"
        className="flex items-center w-8 px-2 mx-2 text-xs font-normal text-gray-800 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:border focus:border-indigo-700 dark:border-gray-200"
        defaultValue={30}
      />
      <p className="-mt-1 text-xs text-gray-800 dark:text-gray-100 fot-normal">
        per page
      </p>
    </div>
  );
}
