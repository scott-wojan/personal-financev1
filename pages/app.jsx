import React, { useMemo } from "react";
import Grid from "components/Grid";
import { categories } from "data/categories";
import { transactions } from "data/transactions";
import EditableText from "components/editable/EditableText";

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
        // width: 80,
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

        // formatting: {
        //   type: "currency",
        //   settings: {
        //     currencyCode: (x) => x.iso_currency_code,
        //   },
        // },
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

  return <Grid columns={columns} data={transactions.data} />;
}
