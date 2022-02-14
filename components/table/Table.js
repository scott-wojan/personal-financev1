// @ts-nocheck
import React, { useReducer, useEffect } from "react";
import { useFlexLayout, usePagination, useSortBy, useTable } from "react-table";
import { useQuery } from "react-query";
import { Pagination } from "./Pagination";
import DefaultCell from "./DefaultCell";
import Icon from "../Icon";
import { editableComponents } from "../editable";

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: null,
};

const PAGE_CHANGED = "PAGE_CHANGED";
const PAGE_SIZE_CHANGED = "PAGE_SIZE_CHANGED";
const TOTAL_COUNT_CHANGED = "TOTAL_COUNT_CHANGED";

const reducer = (state, { type, payload }) => {
  switch (type) {
    case PAGE_CHANGED:
      return {
        ...state,
        queryPageIndex: payload,
      };
    case PAGE_SIZE_CHANGED:
      return {
        ...state,
        queryPageSize: payload,
      };
    case TOTAL_COUNT_CHANGED:
      return {
        ...state,
        totalCount: payload,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export default function Table({ columns, query, onChange = undefined }) {
  const [{ queryPageIndex, queryPageSize, totalCount }, dispatch] = useReducer(
    reducer,
    initialState
  );

  columns?.forEach((column) => {
    // if a cell was defined, use it
    if (column.Cell) {
      return;
    }
    //If it's marked as editable, get that control
    if (
      column.isEditable &&
      column.dataType &&
      editableComponents.has(column.dataType)
    ) {
      column.Cell = editableComponents.get(column.dataType);
      return;
    }
    //otherwise use the default cell
    column.Cell = DefaultCell;
  });

  const { isLoading, error, data, isSuccess } = useQuery(
    [query.name, queryPageIndex, queryPageSize],
    () => query.function(queryPageIndex, queryPageSize, ...query.params),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: isSuccess ? data?.data : [],
      updateMyData: onChange,
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
        hiddenColumns: columns
          .filter((col) => col.show === false)
          .map((col) => col.accessor),
      },
      manualPagination: true,
      pageCount: isSuccess ? Math.ceil(totalCount / queryPageSize) : null,
      autoResetPage: false,
      autoResetRowState: false,
      autoResetSortBy: false,
      autoResetFilters: false,
    },
    useSortBy,
    usePagination,
    useFlexLayout
  );

  useEffect(() => {
    dispatch({ type: PAGE_CHANGED, payload: pageIndex });
  }, [pageIndex]);

  useEffect(() => {
    dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
    gotoPage(0);
  }, [pageSize, gotoPage]);

  useEffect(() => {
    if (data?.total) {
      dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: data.total,
      });
    }
  }, [data?.total]);

  if (error) {
    return <p>Error</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {!isSuccess && !data ? null : (
        <>
          <table {...getTableProps()}>
            <Head headerGroups={headerGroups} />
            <Body {...{ getTableBodyProps, page, prepareRow, onChange }} />
          </table>
          <Pagination
            {...{
              pageSize,
              setPageSize,
              gotoPage,
              canPreviousPage,
              previousPage,
              pageIndex,
              pageOptions,
              nextPage,
              canNextPage,
              pageCount,
            }}
          />
        </>
      )}
    </>
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

function Body({ getTableBodyProps, page, prepareRow, onChange }) {
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

function Head({ headerGroups }) {
  return (
    <thead>
      {headerGroups.map((headerGroup, index) => (
        <tr key={index} {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column, index) => (
            <th
              key={index}
              {...column.getHeaderProps(column.getSortByToggleProps())}
            >
              {column.render("Header")}
              {
                <>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <Icon name="caret-down-outline" />
                    ) : (
                      <Icon name="caret-up-outline" />
                    )
                  ) : (
                    ""
                  )}
                </>
              }
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
