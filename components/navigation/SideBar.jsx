import React from "react";
import { List } from "../List";

export default function SideBar({
  links = undefined,
  top = undefined,
  bottom = undefined,
  children = undefined,
  onItemClick = undefined,
}) {
  return (
    <div className="flex flex-col flex-1 list-none">
      <div>{top}</div>
      <List onItemClick={onItemClick} links={links} />
      {children}
      <div className="absolute bottom-0 left-0 ">{bottom}</div>
    </div>
  );
}
