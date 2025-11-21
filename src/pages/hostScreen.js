import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set, update, get } from "firebase/database";
import "./Host.css";

export function HostScreen() {
  const [queues, setQueues] = useState({
    shakyHands: [],
    addingOn: [],
    newPoint: []
  });

  const [counts, setCounts] = useState({
    fist: 0,
    shaky: 0
  });

  const [currentSpeaker, setCurrentSpeaker] = useState("");
  const [slotStates, setSlotStates] = useState({});

  // REALTIME LISTENERS
  useEffect(() => {
    onValue(ref(db, "queues"), (snap) => {
      const q = snap.val() || {};
      setQueues({
        shakyHands: q.shakyHands || [],
        addingOn: q.addingOn || [],
        newPoint: q.newPoint || []
      });
    });

    onValue(ref(db, "counts"), (snap) => {
      const c = snap.val() || {};
      setCounts({
        fist: c.fist || 0,
        shaky: c.shaky || 0
      });
    });

    onValue(ref(db, "currentSpeaker"), (snap) => {
      setCurrentSpeaker(snap.val() || "");
    });

    onValue(ref(db, "slotStates"), (snap) => {
      setSlotStates(snap.val() || {});
    });
  }, []);

  // CLEAR ONE QUEUE + RESET SLOT FLAGS
  const clearQueue = async (queueName) => {
    // clear the list
    await set(ref(db, `queues/${queueName}`), []);

    // reset shaky counter if shakyHands cleared
    if (queueName === "shakyHands") {
      await update(ref(db, "counts"), { shaky: 0 });
    }

    // reset slot flags
    const snap = await get(ref(db, "slotStates"));
    if (!snap.exists()) return;

    const allSlots = snap.val();

    const flagKey = {
      shakyHands: "shaky",
      addingOn: "addingOn",
      newPoint: "newPoint"
    }[queueName];

    for (const name in allSlots) {
      await update(ref(db, `slotStates/${name}`), {
        [flagKey]: false
      });
    }
  };

  // CLEAR ALL QUEUES + RESET COUNTS + RESET SLOT FLAGS
  const clearAllQueues = async () => {
    await set(ref(db, "queues"), {
      shakyHands: [],
      addingOn: [],
      newPoint: []
    });

    await update(ref(db, "counts"), {
      shaky: 0,
      fist: 0
    });

    const snap = await get(ref(db, "slotStates"));
    if (!snap.exists()) return;

    const allSlots = snap.val();
    for (const name in allSlots) {
      await update(ref(db, `slotStates/${name}`), {
        shaky: false,
        addingOn: false,
        newPoint: false,
        fist: false
      });
    }
  };

  // NEXT PERSON LOGIC
  const handleNextPerson = async () => {
    const shakyHands = queues.shakyHands || [];
    const addingOn = queues.addingOn || [];
    const newPoint = queues.newPoint || [];

    // 1️⃣ Pick next person in priority order
    const next =
        (shakyHands.length > 0 && shakyHands[0]) ||
        (addingOn.length > 0 && addingOn[0]) ||
        (newPoint.length > 0 && newPoint[0]) ||
        "";

    // Update Firebase
    await set(ref(db, "currentSpeaker"), next);

    if (!next) return; // no one to process

    // 2️⃣ Remove next from the appropriate queue
    if (shakyHands.includes(next)) {
        await set(ref(db, "queues/shakyHands"), shakyHands.slice(1));
        await update(ref(db, "counts"), { shaky: shakyHands.length - 1 });
    } else if (addingOn.includes(next)) {
        await set(ref(db, "queues/addingOn"), addingOn.slice(1));
    } else if (newPoint.includes(next)) {
        await set(ref(db, "queues/newPoint"), newPoint.slice(1));
    }

    // 3️⃣ Reset their SLOT flags
    await update(ref(db, `slotStates/${next}`), {
        shaky: false,
        addingOn: false,
        newPoint: false,
    });
    };


  return (
    <div className="host-container">
      <h1 className="current-speaker">
        {currentSpeaker && <span>{currentSpeaker} </span>}
        <span>is currently speaking</span>
      </h1>

      <button className="next-btn" onClick={handleNextPerson}>
        Next Person
      </button>

      <div className="columns">
        
        {/* SHAKY */}
        <div className="queue-card">
          <h2>Shaky Hands</h2>
          <button className="clear-btn" onClick={() => clearQueue("shakyHands")}>Clear</button>
          <ul>{queues.shakyHands.map((n, i) => <li key={i}>{n}</li>)}</ul>
        </div>

        {/* NEW POINT */}
        <div className="queue-card">
          <h2>New Point</h2>
          <button className="clear-btn" onClick={() => clearQueue("newPoint")}>Clear</button>
          <ul>{queues.newPoint.map((n, i) => <li key={i}>{n}</li>)}</ul>
        </div>

        {/* ADDING ON */}
        <div className="queue-card">
          <h2>Adding On</h2>
          <button className="clear-btn" onClick={() => clearQueue("addingOn")}>Clear</button>
          <ul>{queues.addingOn.map((n, i) => <li key={i}>{n}</li>)}</ul>
        </div>

      </div>

      <div className="counts-box">
        <div className="count fist-box">
          <span className="count-number">{counts.fist}</span>
          <span>fist of approval</span>
        </div>
        <div className="count shaky-box">
          <span className="count-number">{counts.shaky}</span>
          <span>shaky hands</span>
        </div>
      </div>

      <button className="clear-all-btn" onClick={clearAllQueues}>
        Clear all queues
      </button>
    </div>
  );
}
