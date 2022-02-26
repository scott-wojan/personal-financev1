import DateRangeInput from "components/inputs/DateRangeInput";
import React from "react";
import StackedBarChart from "./StackedBarChart";

export default function CashFlow() {
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
