const { categories } = require("data/categories");
const { useState } = require("react");
const React = require("react");
const { default: Table } = require("./Table");

export default function TransactionsTable() {
  const [cats, setCats] = useState(
    // @ts-ignore
    [...new Set(categories.map((item) => item.category))].map((x) => {
      return { text: x };
    })
  );

  const [subCats, setSubCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState();

  const onChange = (row, propertyName, newValue, oldValue) => {
    if (propertyName === "subcategory") {
      console.log(
        `Table update! Property '${propertyName}' changed from '${oldValue}' to '${newValue.title}' for '${row.values.id}'`,
        row
      );
    } else {
      row.values[propertyName] = newValue;
      console.log(
        `Table update! Property '${propertyName}' changed from '${oldValue}' to '${newValue}' for '${row.values.id}'`,
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
        // isEditable: true,
        width: 80,
        // maxWidth: 150,
        // minWidth: 150,
        // Cell: ({ value }) => {
        //   return formatDate(value);
        // },
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
        dataType: "text",
        // options,
        // width: 250,
        // maxWidth: 250,
        // minWidth: 250,
        Cell: ({ value, onChange }) => {
          const onSelect = (e) => {
            onChange(e.target.value, value);
            value = e.target.value;
            setSelectedCat(value);
            setSubCats(
              categories
                .filter((x) => x.category === value)
                .map((sub) => {
                  return { text: sub.subcategory };
                })
            );
          };
          return (
            <Select
              options={cats}
              onChange={onSelect}
              value={value}
              name="Category"
            />
            // <CategoriesDropdown
            //   options={categories}
            //   value={value}
            //   onChange={onChange}
            // />
          );
        },
      },
      {
        Header: "Sub Category",
        accessor: "subcategory",
        dataType: "text",
        isEditable: true,
        width: 200,
        Cell: ({ value, onChange }) => {
          const onSelect = (e) => {
            console.log("subcategory", e.target.value);
            onChange(e.target.value, value);
          };

          return (
            <Select
              options={subCats}
              onChange={onSelect}
              value={value}
              name="Sub Category"
            />
            // <CategoriesDropdown
            //   options={categories}
            //   value={value}
            //   onChange={onChange}
            // />
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
    [selectedCat]
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

function Select({ value, options, onChange, name }) {
  console.log(`${name} render`);
  return (
    <select
      id="lang"
      className="w-full"
      onChange={onChange}
      defaultValue={value}
    >
      {options.map((cat, key) => (
        <option key={key} value={cat.text}>
          {cat.text}
        </option>
      ))}
    </select>
  );
}
