import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Game from './pages/Game';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/game" element={<Game/>}/>
    </Routes>
  );
}

export default App;
