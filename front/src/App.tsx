import React from 'react';
import './App.css';
import socket from 'socket.io-client'

function App() {
  return (
    <div className="App">
      <button onClick={sendSocket}> Hello </button>
    </div>
  );
}

export default App;
