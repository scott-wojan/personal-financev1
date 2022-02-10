import React, { useState, useRef, useEffect } from "react";

export default function Menu({
  menuItems,
  onClick,
  orientation = "horizontal",
  className = undefined,
}) {
  return (
    <nav>
      <ul
        className={`menu  ${
          orientation == "horizontal" ? "" : "flex-col"
        } ${className}`}
      >
        {menuItems.map((menuItem, index) => {
          const depthLevel = 0;
          return (
            <MenuItem
              key={index}
              items={menuItem}
              depthLevel={depthLevel}
              onClick={onClick}
            />
          );
        })}
      </ul>
    </nav>
  );
}

function MenuItem({ items, depthLevel, onClick }) {
  const [isExpanded, setIsExpanded] = useState(false);

  let ref = useRef();

  useEffect(() => {
    const handler = (event) => {
      // @ts-ignore
      if (isExpanded && ref.current && !ref.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [isExpanded]);

  const onMouseEnter = () => {
    setIsExpanded(true);
  };

  const onMouseLeave = () => {
    setIsExpanded(false);
  };

  return (
    <li
      className="menu-items"
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.submenu ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={isExpanded ? "true" : "false"}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {items.title}
            {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
          </button>
          <SubMenuItems
            depthLevel={depthLevel}
            menuItems={items.submenu}
            show={isExpanded}
            onClick={onClick}
          />
        </>
      ) : (
        <div
          onClick={() => {
            onClick?.(items);
          }}
        >
          {items.title}
        </div>
      )}
    </li>
  );
}

function SubMenuItems({ menuItems, show, depthLevel, onClick }) {
  depthLevel = depthLevel + 1;
  const submenuStyle = depthLevel > 1 ? "sub-menu-item" : "";
  return (
    <ul className={`sub-menu-items ${submenuStyle} ${show ? "show" : ""}`}>
      {menuItems.map((menuItem, index) => (
        <MenuItem
          items={menuItem}
          key={index}
          depthLevel={depthLevel}
          onClick={onClick}
        />
      ))}
    </ul>
  );
}
