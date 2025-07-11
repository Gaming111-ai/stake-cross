import React, { useEffect, useState } from "react";
import { createClient } from "graphql-ws";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [crashData, setCrashData] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!token) return;

    const client = createClient({
      url: "wss://stake.pet/_api/websockets",
      connectionParams: {
        Authorization: `Bearer ${token}`
      },
      lazy: false,
      retryAttempts: 5,
    });

    const unsubscribe = client.subscribe(
      {
        query: `subscription {
          crash {
            id
            multiplier
            createdAt
          }
        }`,
      },
      {
        next: ({ data }) => {
          console.log("Received crash data:", data);
          setCrashData(data.crash);
        },
        error: (err) => console.error("Subscription error", err),
        complete: () => console.log("Subscription complete"),
      }
    );

    setConnected(true);
    return () => unsubscribe();
  }, [token]);

  return (
    <div>
      <h1>Crash Predictor</h1>
      {!connected && (
        <input
          type="text"
          placeholder="Enter your Stake.com Token"
          onChange={(e) => setToken(e.target.value)}
        />
      )}
      {crashData ? (
        <div>
          <p><strong>Crash ID:</strong> {crashData.id}</p>
          <p><strong>Multiplier:</strong> {crashData.multiplier}</p>
          <p><strong>Time:</strong> {new Date(crashData.createdAt).toLocaleString()}</p>
        </div>
      ) : connected ? (
        <p>Waiting for crash data...</p>
      ) : (
        <p>Please enter your token to connect.</p>
      )}
    </div>
  );
};

export default App;
