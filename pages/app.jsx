import React, { useEffect, useMemo, useState } from "react";
import Grid from "components/Grid";
import { categories } from "data/categories";
import { transactions } from "data/transactions";
import EditableText from "components/editable/EditableText";
import TransactionsTable from "components/table/TransactionsTable";
import StyledGrid from "components/grid/StyledGrid";
import { useQuery } from "react-query";
import axios from "axios";

export default function AppHome() {
  const categoryOptions = categories.map((category) => {
    return category;
  });

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        isEditable: true,
        show: false,
      },
      {
        Header: "Date",
        accessor: "date", // accessor is the "key" in the data
        // dataType: "date",
        width: 80,
      },
      {
        Header: "Account",
        accessor: "account",
      },
      {
        Header: "Name",
        accessor: "name",
        dataType: "text",
        isEditable: true,
        Cell: EditableText,
        // width: 250,
      },
      {
        Header: "Category",
        accessor: "category",
        isEditable: true,
        Cell: EditableText,
        // dataType: "select",
        // options: categoryOptions,
      },
      {
        Header: "Sub Category",
        accessor: "subcategory",
        isEditable: true,
        Cell: EditableText,
      },
      {
        Header: "Amount",
        accessor: "amount",
        dataType: "text",
        formatting: {
          type: "currency",
          settings: {
            currencyCode: (x) => x.iso_currency_code,
          },
        },
      },
      {
        Header: "Currency Code",
        accessor: "iso_currency_code",
        isEditable: true,
        show: false,
      },
    ],
    []
  );

  const onCellChange = ({ row, propertyName, newValue, oldValue }) => {
    //console.log("onCellChange: ", propertyName, newValue);
    // setGridData((prev) => {
    //   return {
    //     total: prev.total,
    //     data: prev.data?.map((item, index) => {
    //       if (index === row.index) {
    //         const newRow = {
    //           ...item,
    //           [propertyName]: newValue,
    //         };
    //         return newRow;
    //       }
    //       return item;
    //     }),
    //   };
    // });
  };

  const onRowChange = ({ row, changes }) => {
    console.log("onRowChange: ", row);
    console.log("changes: ", changes);
    // setGridData((prev) => {
    //   return {
    //     total: prev.total,
    //     data: prev.data?.map((item, index) => {
    //       if (index === row.index) {
    //         const newRow = {
    //           ...item,
    //           ...changes,
    //         };
    //         return newRow;
    //       }
    //       return item;
    //     }),
    //   };
    // });
  };

  async function callApi(endpoint, payload) {
    console.log("Calling API ", endpoint);
    try {
      const response = await axios.post(endpoint, payload);
      const data = response;
      return data.data;
    } catch (e) {
      throw new Error(`Table API error:${e?.message}`);
    }
  }

  const [queryPageIndex, setQueryPageIndex] = useState(0);
  const [queryPageSize, setQueryPageSize] = useState(10);
  const [gridData, setGridData] = useState(null);

  const { isLoading, error, data, isSuccess } = useQuery(
    ["/api/transactions", queryPageIndex, queryPageSize],
    () =>
      callApi("/api/transactions", {
        page: queryPageIndex,
        pageSize: queryPageSize,
        accountId: "usaa_checking",
        startDate: "2019-01-01",
        endDate: "2022-01-01",
      }),

    {
      keepPreviousData: true,
      staleTime: 100,
    }
  );

  useEffect(() => {
    setGridData(data);
  }, [data]);

  //    {isLoading  && <div>ssss</div>}
  return (
    <div className="w-3/4">
      {!isLoading && isSuccess && (
        <StyledGrid
          columns={columns}
          data={gridData}
          onRowChange={onRowChange}
          paginationSettings={{
            page: queryPageIndex,
            pageSize: queryPageSize,
            total: Number(gridData?.total),
            onPageChange: setQueryPageIndex,
            onPageSizeChange: setQueryPageSize,
          }}
          onCellChange={onCellChange}
        />
      )}
      {/* <TransactionsTable /> */}

      {/* <Grid
        columns={columns}
        data={transactions}
        onCellChange={onCellChange}
        onRowChange={onRowChange}
      /> */}

      {/* <div>
        {isLoading && <div>Loading... </div>}
        {error && <div>ERROR</div>}
        {isSuccess && <div>{JSON.stringify(gridData)}</div>}
        <br />
      </div> */}
    </div>
  );
}
