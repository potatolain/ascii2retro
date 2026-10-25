import { useState } from "react";

export default function Character({ value, isActive }) {
  return <div className={`character ${isActive ? "active" : ""}`}>{value}</div>;
}
