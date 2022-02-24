// @ts-nocheck
import React, { useReducer, useEffect } from "react";
import { useFlexLayout, usePagination, useSortBy, useTable } from "react-table";
import { useQuery } from "react-query";
import { Pagination } from "./Pagination";
import DefaultCell from "./DefaultCell";
import { editableComponents } from "../editable";
import axios from "axios";
import { Head } from "./Head";
import { Body } from "./Body";

const PAGE_CHANGED = "PAGE_CHANGED";
const PAGE_SIZE_CHANGED = "PAGE_SIZE_CHANGED";
const TOTAL_COUNT_CHANGED = "TOTAL_COUNT_CHANGED";

const reducer = (state, { type, payload }) => {
  console.log("reducer type/payload: ", type, payload);
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

async function callApi(endpoint, payload) {
  try {
    const response = await axios.post(endpoint, payload);
    const data = await response;
    return data.data;
  } catch (e) {
    throw new Error(`Table API error:${e?.message}`);
  }
}

export default function Table({
  columns,
  query,
  onChange = undefined,
  pagingSettings = {
    page: 0,
    pageSize: 10,
  },
}) {
  processColumns(columns);

  const initialState = {
    queryPageIndex: pagingSettings?.page,
    queryPageSize: pagingSettings?.pageSize,
    totalCount: null,
  };

  // console.log("initialState", initialState);

  const [{ queryPageIndex, queryPageSize, totalCount }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // console.log("after reducer", { queryPageIndex, queryPageSize });

  const functionParams = {
    page: queryPageIndex,
    pageSize: queryPageSize,
    ...query.parameters,
  };

  // console.log("functionParams", functionParams);

  const { isLoading, error, data, isSuccess } = useQuery(
    [query.api, queryPageIndex, queryPageSize],
    () =>
      callApi(query.api, {
        ...functionParams,
      }),

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
          {pagingSettings && (
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
          )}
        </>
      )}
    </>
  );
}

function processColumns(columns) {
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
}
