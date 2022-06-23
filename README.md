# reactnative-directline

React Native Directline

## Installation

```sh
npm install reactnative-directline
```

## Usage

```js
import { BotComponent } from 'reactnative-directline';

// ...

<BotComponent
  directLineKey="add DirectLine Key"
  userName="add User Name"
  getConversationId={(conversationId) =>
    console.log('Get Conversation ID', conversationId)
  }
/>;
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
