import React from "react";

export default function ChevronRight({ onClick = undefined }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      role="img"
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      onClick={onClick}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m9 6l6 6l-6 6"
      ></path>
    </svg>
  );
}
