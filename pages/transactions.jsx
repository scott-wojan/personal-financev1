import SideBar from "components/navigation/SideBar";
import Page from "components/Page";
import Table from "components/table/Table";
import React from "react";
import { fetchTransactionData } from "queries/fetchTransactionData";
import CategoriesSelect from "components/inputs/CategoriesSelect";
import { categories } from "data/categories";
export default function transactions() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date", // accessor is the "key" in the data
        dataType: "date",
        // isEditable: true,
        // width: 150,
        // maxWidth: 150,
        // minWidth: 150,
        // Cell: ({ value }) => {
        //   return formatDate(value);
        // },
      },
      {
        Header: "Name",
        accessor: "name",
        dataType: "text",
        // width: 400,
        // minWidth: 400,
        // maxWidth: 400,
        isEditable: true,
        // Cell: ({ value }) => {
        //   return value;
        // },
      },
      {
        Header: "Category",
        accessor: "category",
        // options,
        // width: 250,
        // maxWidth: 250,
        // minWidth: 250,
        isEditable: true,
        Cell: ({ value, onChange }) => {
          return (
            <CategoriesSelect
              options={categories}
              value={value}
              onChange={onChange}
            />
          );
        },
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

  const onChange = (row, propertyName, newValue, oldValue) => {
    if (propertyName === "category") {
      console.log(
        `Table update! Property '${propertyName}' changed from '${oldValue}' to '${newValue.id}' for '${row.values.id}'`,
        row
      );
    } else
      console.log(
        `Table update! Property '${propertyName}' changed from '${oldValue}' to '${newValue}' for '${row.values.id}'`,
        row
      );
  };

  return (
    <Page
      left={
        <SideBar
          top={<div>Top</div>}
          bottom={<div>Bottom</div>}
          links={mainLinks}
          onItemClick={(link) => {
            console.log(link);
          }}
        />
      }
    >
      <Table
        columns={columns}
        onChange={onChange}
        query={{
          name: "transactions",
          function: fetchTransactionData,
          params: ["usaa_checking", "2019-01-01", "2022-01-01"],
        }}
      />

      {/* <CashFlow /> */}
    </Page>
  );
}

const mainLinks = [
  {
    icon: "home-outline",
    text: "Home",
  },
  {
    icon: "log-in-outline",
    text: "Income",
  },
  {
    icon: "log-out-outline",
    text: "Expenses",
  },
  {
    icon: "wallet-outline",
    text: "Savings",
  },
  {
    icon: "bar-chart-outline",
    text: "Investments",
  },
];
