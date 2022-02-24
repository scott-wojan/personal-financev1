import React from "react";
import Icon from "../Icon";

export function Head({ headerGroups }) {
  return (
    <thead>
      {headerGroups.map((headerGroup, index) => (
        <tr key={index} {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column, index) => (
            <th
              key={index}
              {...column.getHeaderProps(column.getSortByToggleProps())}
            >
              {column.render("Header")}
              {
                <>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <Icon name="caret-down-outline" />
                    ) : (
                      <Icon name="caret-up-outline" />
                    )
                  ) : (
                    ""
                  )}
                </>
              }
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
