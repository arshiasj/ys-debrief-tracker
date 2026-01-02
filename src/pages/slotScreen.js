import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import { ref, set, update, get, onValue } from "firebase/database";
import "./SlotScreen.css";

export function SlotScreen() {
  const location = useLocation();
  const slotName = location.state?.name || "";

  const [shaky, setShaky] = useState(false);
  const [addingOn, setAddingOn] = useState(false);
  const [newPoint, setNewPoint] = useState(false);
  const [fist, setFist] = useState(false);

  // =====================================================
  // REAL-TIME LISTENER → REACT TO HOST CLEARING ANYTHING
  // =====================================================
  useEffect(() => {
    const userRef = ref(db, `slotStates/${slotName}`);

    onValue(userRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();

      setShaky(!!data.shaky);
      setAddingOn(!!data.addingOn);
      setNewPoint(!!data.newPoint);
      setFist(!!data.fist);
    });
  }, [slotName]);

  // =====================================================
  // Helper: Add to queue
  // =====================================================
  async function addToQueue(queueName) {
    const queueRef = ref(db, `queues/${queueName}`);
    const snap = await get(queueRef);
    let arr = snap.exists() && Array.isArray(snap.val()) ? snap.val() : [];

    if (!arr.includes(slotName)) {
      arr.push(slotName);
      await set(queueRef, arr);
    }
  }

  // =====================================================
  // Helper: Remove from queue
  // =====================================================
  async function removeFromQueue(queueName) {
    const queueRef = ref(db, `queues/${queueName}`);
    const snap = await get(queueRef);
    let arr = snap.exists() && Array.isArray(snap.val()) ? snap.val() : [];

    arr = arr.filter((n) => n !== slotName);
    await set(queueRef, arr);
  }

  // =====================================================
  // Helper: Set Fist or Shaky counts
  // =====================================================
  function setCount(countName, value) {
    update(ref(db, `counts/`), {
      [countName]: value
    });
  }

  // =====================================================
  // BUTTON LOGIC
  // =====================================================
  async function toggleShaky() {
    const newValue = !shaky;
    console.log(newValue);
    setShaky(newValue);
    update(ref(db, `slotStates/${slotName}`), { shaky: newValue });

    if (newValue) {
      await addToQueue("shakyHands");
    } else {
      await removeFromQueue("shakyHands");
    }

    const shakyQueueRef = ref(db, 'queues/shakyHands');
    let shakyCount = 0;
    onValue(shakyQueueRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      shakyCount = data ? data.length : 0;

      console.log(shakyCount)
      setCount("shaky", shakyCount);
    });
  }

  async function toggleAddingOn() {
    const newValue = !addingOn;
    setAddingOn(newValue);
    update(ref(db, `slotStates/${slotName}`), { addingOn: newValue });

    if (newValue) addToQueue("addingOn");
    else removeFromQueue("addingOn");
  }

  async function toggleNewPoint() {
    const newValue = !newPoint;
    setNewPoint(newValue);
    update(ref(db, `slotStates/${slotName}`), { newPoint: newValue });

    if (newValue) addToQueue("newPoint");
    else removeFromQueue("newPoint");
  }

  async function toggleFist() {
    const newValue = !fist;
    setFist(newValue);

    const fistRef = ref(db, `counts/fist`);
    const snap = await get(fistRef);
    let data = snap.val() || 0;
    console.log(data)

    if (newValue) { // add fist of approval
      data = data + 1;
    } else { // remove fist of approval
      data = Math.max(0, data - 1);
    }

    console.log(data);
    setCount("fist", data);
    update(ref(db, `slotStates/${slotName}`), { fist: newValue });
  }

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="landing-container">

      <h1 className="title">
        <span className="brush-highlight">SLOT Debrief Tracker</span>
      </h1>

      <div className="slot-buttons-wrapper">

        <button
          onClick={toggleShaky}
          className={`slot-toggle-btn ${shaky ? "active" : ""}`}
        >
          {shaky ? "Leave Shaky Hands" : "Join Shaky Hands"}
        </button>

        <button
          onClick={toggleAddingOn}
          className={`slot-toggle-btn ${addingOn ? "active" : ""}`}
        >
          {addingOn ? "Leave Adding On" : "Join Adding On"}
        </button>

        <button
          onClick={toggleNewPoint}
          className={`slot-toggle-btn ${newPoint ? "active" : ""}`}
        >
          {newPoint ? "Leave New Point" : "Join New Point"}
        </button>

        <button
          onClick={toggleFist}
          className={`slot-toggle-btn ${fist ? "active" : ""}`}
        >
          {fist ? "Leave Fist of Approval" : "Join Fist of Approval"}
        </button>

      </div>
    </div>
  );
}
