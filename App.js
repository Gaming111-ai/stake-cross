import React, { useState } from "react";

const App = () => {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    if (token.trim()) {
      setConnected(true);
      alert("Connected using token: " + token);
    } else {
      alert("Please enter a valid API token.");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Crash Predictor</h1>
      {!connected ? (
        <div>
          <input
            type="text"
            placeholder="Enter API Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ padding: 8, width: "300px" }}
          />
          <button onClick={handleConnect} style={{ marginLeft: 10, padding: 8 }}>
            Connect
          </button>
        </div>
      ) : (
        <p>Connected! Ready to fetch crash multipliers.</p>
      )}
    </div>
  );
};

export default App;
