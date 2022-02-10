// @ts-nocheck
import React from "react";

export default function Icon({
  name,
  onClick = undefined,
  className = undefined,
  size = 20,
}) {
  return (
    <span onClick={onClick} className={"flex "}>
      <ion-icon name={name} style={{ fontSize: size }}></ion-icon>
    </span>
  );
}
