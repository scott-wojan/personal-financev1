import CategoriesSelect from "components/inputs/CategoriesSelect";
import Dropdown from "components/inputs/Dropdown";
import Menu from "components/navigation/Menu";
import { categories } from "data/categories";
import { fetchPokemonData } from "queries/fetchPokemonData";
import { fetchTransactionData } from "queries/fetchTransactionData";
import React, { useEffect, useRef, useState } from "react";
import DoughnutChart from "../components/charts/DoughnutChart";
import StackedBarChart from "../components/charts/StackedBarChart";
import Icon from "../components/Icon";
import SideBar from "../components/navigation/SideBar";
import Page from "../components/Page";
import Table from "../components/table/Table";

export default function AppHome() {
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
      {/* <Table queryName="pokemons" query={fetchPokemonData} columns={columns} /> */}
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
      {/* <div className="flex flex-col">
        <CategoriesSelect
          menuItems={categories}
          initialValue={value}
          onChange={(x) => {
            console.log("CategoriesSelect:onChange", x);
            setValue(x.title);
          }}
        />
      </div> */}
      {/* <Table
        columns={columns}
        onChange={onChange}
        query={{
          name: "transactions",
          function: fetchTransactionData,
          params: ["usaa_checking", "2019-01-01", "2022-01-01"],
        }}
      /> */}

      <div className="flex">
        <div className="w-1/2">
          <StackedBarChart />
        </div>
        <div className="flex justify-center w-1/4 align-center h-80">
          {/* <DoughnutChart /> */}
        </div>
      </div>
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
