import React from "react";
import "./Button.css";

export default function Button({ children, onClick, variant = "primary" }) {
  return (
    <button className={`btn ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
