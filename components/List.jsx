import React, { useState } from "react";
import Icon from "./Icon";

export function List({
  children = undefined,
  links = undefined,
  depth = 0,
  onItemClick = undefined,
}) {
  return (
    <ul className="flex flex-col flex-1 list-none">
      {children}
      {links?.map((link, index) => {
        return (
          <ListItem
            key={index}
            link={link}
            depth={depth}
            onItemClick={onItemClick}
          />
        );
      })}
    </ul>
  );
}

export function ListItem({ link, depth, onItemClick }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <li>
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-primary hover:text-white"
        onClick={() => {
          onItemClick?.(link);
        }}
      >
        <div className="flex items-center justify-between">
          <div
            style={{ paddingLeft: depth * 15 }}
            className="flex items-center align-middle "
          >
            {link.icon && <Icon name={link.icon} />}
            <span className="ml-1">{link.text}</span>
          </div>
        </div>
        {link.links && (
          <Icon
            name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          />
        )}
      </div>
      {isExpanded && (
        <List links={link.links} depth={depth + 1} onItemClick={onItemClick} />
      )}
    </li>
  );
}
