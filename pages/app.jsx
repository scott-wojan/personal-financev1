import CategoriesDropdown from "components/inputs/CategoriesDropdown";
import DateInput from "components/inputs/DateInput";
import DateRangeInput from "components/inputs/DateRangeInput";
import Dropdown from "components/inputs/Dropdown";
import Menu from "components/navigation/Menu";
import { categories } from "data/categories";
import { fetchPokemonData } from "queries/fetchPokemonData";
import React, { useEffect, useRef, useState } from "react";
import DoughnutChart from "../components/charts/DoughnutChart";
import StackedBarChart from "../components/charts/StackedBarChart";
import Icon from "../components/Icon";
import SideBar from "../components/navigation/SideBar";
import Page from "../components/Page";
import Table from "../components/table/Table";

export default function AppHome() {
  return <TransactionsTable />;
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
function CashFlow() {
  return (
    <div className="">
      <div className="w-1/2">
        <div className="flex flex-row justify-between ">
          <div className="font-semibold">Cash Flow</div>
          <DateRangeInput
            onChange={(startDate, endDate) => {
              console.log(startDate, endDate);
            }}
          />
        </div>
        <div>
          <StackedBarChart />
        </div>
        <div>
          <div className="flex items-center justify-between md:justify-start">
            <div className="">
              <p className="text-xs text-gray-400">Income</p>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-400">
                $241,817.23
              </p>
            </div>
            <div className="pl-8 border-gray-100 md:border-l dark:border-gray-700">
              <p className="text-xs text-gray-400">Expenses</p>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-400">
                -$154,648.04
              </p>
            </div>
            <div className="pl-8 border-gray-100 md:border-l dark:border-gray-700">
              <p className="text-xs text-gray-400">Investments</p>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-400">
                $158,880.00
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-1/4 align-center h-80">
        {/* <DoughnutChart /> */}
      </div>
    </div>
  );
}

function TransactionsTable() {
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
            <Select options={cats} onChange={onSelect} value={value} />
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
            <Select options={subCats} onChange={onSelect} value={value} />
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
      {/* <div className="w-96">
        <div className="relative inline-block">
          <input type="text" id="input-field" />
          <div className="absolute w-full ">
            <Menu orientation="vertical" />
            <br />
            <Menu />
          </div>
        </div>
      </div> */}
      {/* 
      <div className="flex flex-col">
        <CategoriesSelect
          menuItems={categories}
          initialValue={value}
          onChange={(x) => {
            console.log("CategoriesSelect:onChange", x);
            setValue(x.title);
          }}
        />
      </div> 
      */}
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

      {/* <CashFlow /> */}
    </Page>
  );
}

function Select({ value, options, onChange }) {
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
