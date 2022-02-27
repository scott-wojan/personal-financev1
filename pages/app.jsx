import Table from "components/table/Table";
import React from "react";
import { categories } from "data/categories";
import EditableSelect from "components/editable/EditableSelect";

export default function AppHome() {
  const categoryOptions = categories.map((category) => {
    return category;
  });

  const onChange = (row, propertyName, newValue, oldValue) => {
    if (propertyName === "category") {
      row.subcategory = "";
      // console.log(
      //   `Table update! Property '${propertyName}' changed from '${oldValue}' to '${newValue}' for '${row.id}'`,
      //   row
      // );
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
        Cell: ({ value, onChange, row, ...rest }) => {
          const subcategories =
            categories.find((x) => x.value === row.values.category)
              ?.subcategories ?? [];

          const options = subcategories.map((subcategory) => {
            return subcategory;
          });

          options.unshift({ label: "", value: "" });
          // console.log("value", value);

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
