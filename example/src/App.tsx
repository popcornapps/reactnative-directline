import React from 'react';
import { BotComponent } from 'reactnative-directline';

export default function App() {
  return (
    <BotComponent
      directLineKey="add DirectLine Key"
      userName="add User Name"
      getConversationId={(conversationId) =>
        console.log('Get Conversation ID', conversationId)
      }
    />
  );
}
