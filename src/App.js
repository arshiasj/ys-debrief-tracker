
import React, { useState, useEffect } from "react";
import { db } from './firebase';
import { ref, onValue } from "firebase/database";

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from './pages/landing';
import { SlotRole } from './pages/slotRole';
import { HostRole } from './pages/hostRole';
import { SlotScreen } from './pages/slotScreen';
import { HostScreen } from './pages/hostScreen';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/slotName" element={<SlotRole/>}/>
        <Route path="/password" element={<HostRole/>}/>
        <Route path="/slot" element={<SlotScreen/>}/>
        <Route path="/host" element={<HostScreen/>}/>
      </Routes>
    </Router>

  );
}

export default App;