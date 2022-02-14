import React from "react";
import { useQuery } from "react-query";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Income vs. Expenses",
    },
    legend: {
      position: "top",
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
// const incomeData = labels.map(() =>
//   faker.datatype.number({ min: 0, max: 1000 })
// );
// const expenseData = labels.map(() =>
//   faker.datatype.number({ min: -1000, max: 0 })
// );

const incomeData = [
  8824.29, 8832.5, 104536.16, 8834.06, 8930.09, 8992.19, 7430.29, 23676.83,
  10749.14, 15560.2, 20999.72, 14451.76,
];

const expenseData = [
  -36907.89, -17414.69, -30716.21, -105045.59, -28717.66, -13112.9, -10205.87,
  -15243.04, -14982.26, -12700.08, -9840.73, -18641.12,
];

console.log(incomeData, expenseData);

const diff = incomeData.map((data, index) => {
  return incomeData[index] + expenseData[index];
});

export const data = {
  labels,
  datasets: [
    {
      type: "line",
      label: "Net",
      borderColor: "rgb(255, 199, 132)",
      backgroundColor: "rgb(255, 199, 132)",
      borderWidth: 2,
      fill: true,
      data: diff,
    },
    {
      label: "Income",
      data: incomeData,
      backgroundColor: "rgb(75, 192, 192)",
    },
    {
      label: "Expenses",
      data: expenseData,
      backgroundColor: "rgb(255, 99, 132)",
    },
  ],
};

export default function StackedBarChart() {
  // @ts-ignore
  return <Bar options={options} data={data} />;
}
