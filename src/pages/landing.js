import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export function Landing() {
  return (
    <div className="landing-container">
      
      <h1 className="title">
        <span className="brush-highlight">SLOT Debrief Tracker</span>
      </h1>

      <p className="subtitle">Who are you?</p>

      <div className="button-container">
        <Link to="/slotName" className="big-button">SLOT</Link>
        <Link to="/password" className="big-button">Host</Link>
      </div>

    </div>
  );
}
