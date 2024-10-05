import React, { useEffect, useState } from "react";
import NFTAllocation from "./components/NFTAllocation";
import Portfolio from "./components/Portfolio";
import Footer from "./components/Footer";
import './App.css'; // Import your styles

function App() {
  return (
    <div className="App">
      <header className="hero-section">
        <h1>DEFO Ventures</h1>
      </header>
      <div className="container">
        <NFTAllocation />
        <Portfolio />
        <Footer />
      </div>
    </div>
  );
}

export default App;
