import React from 'react';
import logo from './assets/penguin_waving.gif';
import './App.css';

import { Card } from '@mui/material';
import Home from "./Home.js"
import bg from "./assets/background.png"

function App() {

  return (
    <div className="App">
      <header className="App-header"  style={{
      backgroundImage:`url(${bg})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      }}>
        <Home />
      </header>
    </div>
  );
}

export default App;
