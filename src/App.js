import React, { useEffect, useState } from "react";
import { createClient } from "graphql-ws";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [crashData, setCrashData] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("stakeToken") || "");

  useEffect(() => {
    if (!token) return;

    const client = createClient({
      url: "wss://stake.pet/_api/websockets",
      connectionParams: {
        Authorization: `Bearer ${token}`,
      },
      lazy: false,
      retryAttempts: 5,
    });

    const unsubscribe = client.subscribe(
      {
        query: `subscription {
          crash {
            id
            crash_point
            game_id
            updated_at
          }
        }`,
      },
      {
        next: ({ data }) => {
          console.log("Received crash data:", data);
          if (data?.crash) {
            setCrashData(data.crash);
          }
        },
        error: (err) => {
          console.error("Subscription error", err);
          setConnected(false);
        },
        complete: () => {
          console.log("Subscription complete");
        },
      }
    );

    setConnected(true);

    return () => {
      unsubscribe();
      setConnected(false);
    };
  }, [token]);

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (token) {
      localStorage.setItem("stakeToken", token);
      window.location.reload();
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>💥 Stake.pet Crash Predictor</h1>
      {!connected && (
        <form onSubmit={handleTokenSubmit}>
          <input
            type="text"
            placeholder="Enter your Stake.pet Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ padding: "0.5rem", width: "300px" }}
          />
          <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: "1rem" }}>
            Connect
          </button>
        </form>
      )}
      {connected && (
        <p>Status: <strong style={{ color: "green" }}>🟢 Connected</strong></p>
      )}
      {crashData ? (
        <div style={{ marginTop: "2rem", background: "#f2f2f2", padding: "1rem", borderRadius: "10px" }}>
          <h2>Live Crash Data</h2>
          <p><strong>Crash Point:</strong> {crashData.crash_point}x</p>
          <p><strong>Game ID:</strong> {crashData.game_id}</p>
          <p><strong>Updated At:</strong> {new Date(crashData.updated_at).toLocaleString()}</p>
        </div>
      ) : connected ? (
        <p>Waiting for live crash data...</p>
      ) : (
        <p>Please enter your token to connect to Stake.pet</p>
      )}
    </div>
  );
};

export default App;
