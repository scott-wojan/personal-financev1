import Table from "components/table/Table";
import React from "react";
import { categories } from "data/categories";
import EditableSelect from "components/editable/EditableSelect";

export default function AppHome() {
  const categoryOptions = categories.map((category) => {
    return {
      label: category.name,
      value: category.name,
    };
  });

  const subcategories = [
    { label: "Salary", value: "Salary" },
    { label: "Interest", value: "Interest" },
    { label: "General", value: "General" },
    { label: "Life Insurance", value: "Life Insurance" },
    { label: "Clothing", value: "Clothing" },
    { label: "Payment", value: "Payment" },
  ];

  const onChange = (row, propertyName, newValue, oldValue) => {
    if (propertyName === "category") {
      row.subcategory = null;
      console.log(
        `Table update! Property '${propertyName}' changed from '${oldValue}' to '${newValue}' for '${row.id}'`,
        row
      );
    } else {
      row[propertyName] = newValue;
      console.log(
        `Table update! Property '${propertyName}' changed from '${oldValue}' to '${newValue}' for '${row.id}'`,
        row
      );
    }
  };

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
        isEditable: true,
        dataType: "select",
        options: categoryOptions,
      },
      {
        Header: "Sub Category",
        accessor: "subcategory",
        isEditable: true,
        dataType: "select",
        options: subcategories,
        Cell: ({ value, onChange, row }) => {
          const subcategories =
            categories.find((x) => x.name === row.values.category)
              ?.subcategories ?? [];

          const options = subcategories.map((subcategory) => {
            return {
              label: subcategory.name,
              value: subcategory.name,
            };
          });

          // return <div>{value}</div>;
          return (
            <EditableSelect
              options={options}
              onChange={onChange}
              value={value}
            />
          );
        },
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
      onChange={onChange}
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
