import React, { useMemo, useRef, useState } from "react";
import {
  useFlexLayout,
  useRowSelect,
  useRowState,
  useTable,
} from "react-table";

const StyledGrid = ({ data }) => {
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

  const [dropdownStatus, setDropdownStatus] = useState(0);
  const [tableData, setTableData] = useState(data);
  const tableRef = useRef(null);
  const tbodyRef = useRef(null);

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
    <div>
      <table
        ref={tableRef}
        className="min-w-full bg-white border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-200"
        id="main-table"
      >
        <thead>
          <tr className="w-full bg-gray-100 border-b border-gray-300 dark:border-gray-200">
            <th className="w-24 py-3 pl-3">
              <div className="flex items-center">
                <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                  Details
                </p>
              </div>
            </th>
            <th
              className="w-32 whitespace-no-wrap cursor-pointer first-dropdown"
              onClick={() => {
                dropdownStatus == 0
                  ? setDropdownStatus(8)
                  : setDropdownStatus(0);
              }}
            >
              <div className="relative flex items-center justify-between chuss-div">
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
              onclick="dropdownFunction(this)"
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
              onclick="dropdownFunction(this)"
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
              onclick="dropdownFunction(this)"
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
              onclick="dropdownFunction(this)"
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
              onclick="dropdownFunction(this)"
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
              onclick="dropdownFunction(this)"
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
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()} ref={tbodyRef}>
          <TableRow
            dropdownStatus={dropdownStatus}
            setDropdownStatus={setDropdownStatus}
          />
          <tr className="border-b border-gray-300 dark:border-gray-200">
            <td className="w-24 py-3 pl-3">
              <div className="flex items-center">
                <a
                  onClick={() => {
                    dropdownStatus == 0
                      ? setDropdownStatus(2)
                      : setDropdownStatus(0);
                  }}
                  className="ml-2 mr-2 text-gray-800 border border-transparent rounded cursor-pointer focus:outline-none dark:text-gray-100 lg:ml-4 sm:mr-0"
                  href="javascript: void(0)"
                >
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
                </a>
              </div>
            </td>
            <td className="w-32 whitespace-no-wrap">
              <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                Jade's website
              </p>
            </td>
            <td className="w-32 pl-4 whitespace-no-wrap">
              <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                Design
              </p>
            </td>
            <td className="w-32 pl-4 whitespace-no-wrap">
              <div className="flex items-center justify-center w-20 h-6 bg-red-200 rounded-md">
                <span className="text-xs font-normal text-red-500">
                  Pending
                </span>
              </div>
            </td>
            <td className="w-32 pl-4 whitespace-no-wrap">
              <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                Medium
              </p>
            </td>
            <td className="w-32 pl-4 whitespace-no-wrap">
              <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                Jason Smith
              </p>
            </td>
            <td className="w-32 pl-4 whitespace-no-wrap">
              <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                6/28/2020
              </p>
            </td>
            <td className="w-32 pl-4 whitespace-no-wrap">
              <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
                9/28/2020
              </p>
            </td>
            <td class="pl-4 pr-4 whitespace-no-wrap w-32">
              <div class="relative">
                <div
                  class="relative z-0 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 flex items-center justify-between border rounded border-gray-300 dark:border-gray-200 w-full cursor-pointer text-xs form-select block py-2 px-2 xl:px-3 border border-gray-300 dark:border-gray-200 rounded bg-transparent"
                  onClick={() => {
                    dropdownStatus == 0
                      ? setDropdownStatus(16)
                      : setDropdownStatus(0);
                  }}
                >
                  <p class="leading-3 tracking-normal font-normal">
                    Edit Project
                  </p>
                  <div class="cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="hidden icon icon-tabler icon-tabler-chevron-up"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <polyline points="6 15 12 9 18 15" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-chevron-up"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                {dropdownStatus == 16 && (
                  <ul class="z-10 bg-white dark:bg-gray-800 transition duration-300 bg-white dark:bg-gray-800 shadow rounded mt-2 w-48 py-1 absolute">
                    <li class="cursor-pointer text-gray-600 dark:text-gray-400 text-sm leading-3 tracking-normal py-3 hover:bg-gray-100 px-3 font-normal">
                      Edit Project
                    </li>
                    <li class="cursor-pointer text-gray-600 dark:text-gray-400 text-sm leading-3 tracking-normal py-3 hover:bg-gray-100 px-3 font-normal">
                      Delete Project
                    </li>
                  </ul>
                )}
              </div>
            </td>
          </tr>
          {dropdownStatus == 2 && (
            <tr className="detail-row">
              <td colSpan={9}>
                <div className="flex items-stretch w-full border-b border-gray-300 dark:border-gray-200">
                  <ul>
                    <li className="flex items-center justify-center text-sm leading-3 tracking-normal cursor-pointer">
                      <a
                        className="p-3 text-gray-800 border border-transparent dark:text-gray-100 focus:outline-none hover:text-indigo-700 focus:bg-indigo-700 focus:text-white"
                        href="javascript: void(0)"
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
                        href="javascript: void(0)"
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
                        href="javascript: void(0)"
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
                        href="javascript: void(0)"
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
                      <hr className="w-full my-6 border-t border-gray-300 dark:border-gray-200" />
                      <h5 className="mb-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                        Message
                      </h5>
                      <p className="w-3/5 text-xs font-normal leading-6 text-gray-800 dark:text-gray-100">
                        But I must explain to you how all this mistaken idea of
                        denouncing pleasure and praising pain was born and I
                        will give you a complete account of the system, and
                        expound the actual teachings of the great explorer of
                        the truth, the master-builder of human happiness. No one
                        rejects, dislikes, or avoids pleasure itself, because it
                        is pleasure, but because those who do not know how to
                        pursue pleasure rationally encounter consequences that
                        are extremely painful
                      </p>
                      <h5 className="mt-12 mb-2 text-xs font-bold text-indigo-700">
                        Recommended Action
                      </h5>
                      <p className="w-3/5 text-xs font-normal leading-6 text-gray-800 dark:text-gray-100">
                        But I must explain to you how all this mistaken idea of
                        denouncing pleasure and praising pain was born and I
                        will give you a complete account of the system, and
                        expound the actual teachings of the great explorer of
                        the truth, the master-builder of human happiness. No one
                        rejects, dislikes, or avoids pleasure itself, because it
                        is pleasure, but because those who do not know how to
                        pursue pleasure rationally encounter consequences that
                        are extremely painful
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination />
    </div>
  );
};
export default StyledGrid;

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

function TableRow({ dropdownStatus, setDropdownStatus }) {
  return (
    <>
      <tr className="border-b border-gray-300 dark:border-gray-200">
        <td className="w-24 py-3 pl-3">
          <div className="flex items-center">
            <a
              onClick={() => {
                dropdownStatus == 0
                  ? setDropdownStatus(1)
                  : setDropdownStatus(0);
              }}
              className="ml-2 mr-2 text-gray-800 border border-transparent rounded cursor-pointer focus:outline-none dark:text-gray-100 lg:ml-4 sm:mr-0"
              href="javascript: void(0)"
            >
              <ChevronDown />
            </a>
          </div>
        </td>
        <td className="w-32 whitespace-no-wrap">
          <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
            Software Develop…
          </p>
        </td>
        <td className="w-32 pl-4 whitespace-no-wrap">
          <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
            Development
          </p>
        </td>
        <td className="w-32 pl-4 whitespace-no-wrap">
          <div className="flex items-center justify-center w-20 h-6 bg-blue-200 rounded-md">
            <span className="text-xs font-normal text-blue-500">Assigned</span>
          </div>
        </td>
        <td className="w-32 pl-4 whitespace-no-wrap">
          <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
            High
          </p>
        </td>
        <td className="w-32 pl-4 whitespace-no-wrap">
          <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
            Jason Smith
          </p>
        </td>
        <td className="w-32 pl-4 whitespace-no-wrap">
          <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
            6/28/2020
          </p>
        </td>
        <td className="w-32 pl-4 whitespace-no-wrap">
          <p className="text-xs font-normal leading-4 tracking-normal text-left text-gray-800 dark:text-gray-100">
            9/28/2020
          </p>
        </td>
        <td class="pl-4 pr-4 whitespace-no-wrap w-32">
          <div class="relative">
            <div
              class="relative z-0 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 flex items-center justify-between border rounded border-gray-300 dark:border-gray-200 w-full cursor-pointer text-xs form-select block py-2 px-2 xl:px-3 border border-gray-300 dark:border-gray-200 rounded bg-transparent"
              onClick={() => {
                dropdownStatus == 0
                  ? setDropdownStatus(15)
                  : setDropdownStatus(0);
              }}
            >
              <p class="leading-3 tracking-normal font-normal">Edit Project</p>
              <div class="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="hidden icon icon-tabler icon-tabler-chevron-up"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <polyline points="6 15 12 9 18 15" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-chevron-up"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            {dropdownStatus == 15 && (
              <ul class="z-10 bg-white dark:bg-gray-800 transition duration-300 bg-white dark:bg-gray-800 shadow rounded mt-2 w-48 py-1 absolute">
                <li class="cursor-pointer text-gray-600 dark:text-gray-400 text-sm leading-3 tracking-normal py-3 hover:bg-gray-100 px-3 font-normal">
                  Edit Project
                </li>
                <li class="cursor-pointer text-gray-600 dark:text-gray-400 text-sm leading-3 tracking-normal py-3 hover:bg-gray-100 px-3 font-normal">
                  Delete Project
                </li>
              </ul>
            )}
          </div>
        </td>
      </tr>
      {dropdownStatus == 1 && <TableSubRow />}
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
                href="javascript: void(0)"
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
                href="javascript: void(0)"
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
                href="javascript: void(0)"
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
                href="javascript: void(0)"
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
        href="javascript: void(0)"
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
        href="javascript: void(0)"
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
