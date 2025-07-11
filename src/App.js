import React from 'react';
import { useStakeCrash } from './useStakeCrash';

function App() {
  const { crashData, isConnected } = useStakeCrash();

  return (
    <div>
      <h1>Crash Predictor</h1>
      <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>

      {crashData ? (
        <div>
          <h2>Live Crash Data:</h2>
          <p>Crash Point: {crashData.crash_point}x</p>
          <p>Game ID: {crashData.game_id}</p>
          <p>Updated At: {new Date(crashData.updated_at).toLocaleString()}</p>
        </div>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}

export default App;
