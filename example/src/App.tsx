import React from 'react';
import { BotComponent } from 'reactnative-directline';

export default function App() {
  return (
    <BotComponent
      directLineKey="hY3AjiD-J1w.YoZkm1Ulde_x_AoDZb8KBbdyUfEj0-el0rjeYrwHg4o"
      userName="Saif"
      getConversationId={(conversationId) =>
        console.log('conversationId', conversationId)
      }
    />
  );
}
