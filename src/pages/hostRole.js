import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SlotRole.css";   // reuse the exact same styling file

export function HostRole() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (password.trim() === "") return;

    navigate("/host", { state: { password } });
  };

  return (
    <div className="landing-container">

      <h1 className="title">
        <span className="brush-highlight">SLOT Debrief Tracker</span>
      </h1>

      <div className="slot-card">
        <p className="slot-label">Enter password:</p>

        <input
          type="password"
          className="slot-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="slot-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>

    </div>
  );
}
