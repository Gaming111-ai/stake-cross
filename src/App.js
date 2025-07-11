import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const App = () => {
  const [gameHistory, setGameHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = prompt("Enter your authentication token:");
    if (!token) {
      alert("Authentication token is required.");
      return;
    }

    const wsUrl = `wss://stake.pet/_api/websockets?token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Adjust this if your actual message structure differs
        if (data.type === "crash_result") {
          const crashPoint = parseFloat(data.crash_point);
          setGameHistory((prev) => {
            const newHistory = [...prev, { name: `Game ${prev.length + 1}`, value: crashPoint }];
            return newHistory.slice(-20); // Last 20 games only
          });

          if (!isUpdating) {
            setIsUpdating(true);
            setTimeout(() => {
              const last5 = gameHistory.slice(-5).map((g) => g.value);
              const avg = last5.length > 0
                ? (last5.reduce((a, b) => a + b, 0) / last5.length).toFixed(2)
                : "0.00";
              setPrediction(avg);
              setIsUpdating(false);
            }, 1000);
          }
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  return (
    <div className="app">
      <h1>Crash Prediction</h1>
      <p>Status: {isConnected ? "Connected ✅" : "Disconnected ❌"}</p>
      <h2>Predicted Next Crash: {prediction ? `${prediction}x` : "Calculating..."}</h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={gameHistory}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#007bff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default App;
