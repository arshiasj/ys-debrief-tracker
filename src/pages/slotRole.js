import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SlotRole.css";

export function SlotRole() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (name.trim() === "") return;
    navigate("/slot", { state: { name } });
  };

  return (
    <div className="slot-container">
      
      <h1 className="title">
        <span className="brush-highlight">SLOT Debrief Tracker</span>
      </h1>

      <div className="slot-card">
        <p className="slot-label">Enter name:</p>
        <input
          type="text"
          className="slot-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="slot-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>

    </div>
  );
}
