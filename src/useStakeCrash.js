// src/useStakeCrash.js
import { useEffect, useState } from 'react';
import { wsClient } from './wsClient';
import { createClient as createWSClient } from 'graphql-ws';

export function useStakeCrash() {
  const [crashData, setCrashData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let unsubscribe;

    const subscribeToCrash = async () => {
      try {
        unsubscribe = wsClient.subscribe(
          {
            query: `subscription { crash { id, game_id, updated_at, created_at, crash_point } }`,
          },
          {
            next: ({ data }) => {
              if (data?.crash) {
                setCrashData(data.crash);
              }
            },
            error: (err) => console.error('GraphQL WS Error:', err),
            complete: () => console.log('Subscription complete'),
          }
        );
        setIsConnected(true);
      } catch (err) {
        console.error('Subscription setup failed:', err);
        setIsConnected(false);
      }
    };

    subscribeToCrash();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { crashData, isConnected };
}
