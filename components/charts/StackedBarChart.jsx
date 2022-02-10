import React from "react";
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
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

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

const labels = ["January", "February", "March", "April", "May", "June", "July"];
const incomeData = labels.map(() =>
  faker.datatype.number({ min: 0, max: 1000 })
);
const expenseData = labels.map(() =>
  faker.datatype.number({ min: -1000, max: 0 })
);

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
