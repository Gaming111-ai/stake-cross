// src/wsClient.js
import { createClient } from 'graphql-ws';

export const wsClient = createClient({
  url: 'wss://stake.pet/_api/websockets',
  retryAttempts: 5,
  retryWait: async function randomisedExponentialBackoff(retries) {
    let retryDelay = 1000 * 2 ** retries + Math.floor(Math.random() * 100);
    return new Promise(resolve => setTimeout(resolve, retryDelay));
  },
});
