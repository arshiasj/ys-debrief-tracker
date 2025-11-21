import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { ref, onValue } from "firebase/database";
export function Landing() {
    const [value, setValue] = useState("");
    useEffect(() => {
        // Reference to /test in the database
        const testRef = ref(db, "test");

        // Listen for real-time updates
        onValue(testRef, (snapshot) => {
        const data = snapshot.val();
        setValue(data);
        });
    }, []);

    return (
        <>
            <div style={{ padding: "30px" }}>
                <h1>Firebase Test</h1>
                <p>Value from database:</p>
                <pre>{JSON.stringify(value, null, 2)}</pre>
            </div>
            <Link to="/slotName">SLOT</Link>
            <Link to="/password">Host</Link>
        </>
    );
}

