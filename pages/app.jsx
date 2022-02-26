import Table from "components/table/Table";
import React from "react";

export default function AppHome() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date", // accessor is the "key" in the data
        dataType: "date",
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
        width: 250,
        isEditable: true,
      },
      {
        Header: "Category",
        accessor: "category",
        dataType: "text",
      },
      {
        Header: "Sub Category",
        accessor: "subcategory",
        dataType: "text",
        isEditable: true,
        width: 200,
      },
      {
        Header: "Amount",
        accessor: "amount",
        dataType: "text",
        // isEditable: true,
        // width: 200,
        // maxWidth: 200,
        // minWidth: 200,
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
      {
        Header: "Id",
        accessor: "id",
        isEditable: true,
        show: false,
      },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      // onChange={onChange}
      // pagingSettings={{ page: 10, pageSize: 10 }}
      query={{
        api: "/api/transactions",
        parameters: {
          accountId: "usaa_checking",
          startDate: "2019-01-01",
          endDate: "2022-01-01",
        },
      }}
    />
  );
}
