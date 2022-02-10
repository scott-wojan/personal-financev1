import React from "react";

export function Pagination({
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
}) {
  return (
    <nav aria-label="pagination" className="flex justify-between">
      <div>
        <div>
          Show{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
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
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <span>&laquo;</span>
          </button>
        </li>
        <li>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>
        </li>
        <span className="page">
          Page {pageIndex + 1} of {pageOptions.length}
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
