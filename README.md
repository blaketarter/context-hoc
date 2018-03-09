# context-hoc

[React-Redux](https://github.com/reactjs/react-redux) inspired global state library using React's new Context API and HOCs

## Example

```js
import { provide } from 'context-hoc';

// ...

const initialState = { message: '' };

const actions = {
  greeting: message => getState => {
    const state = getState();
    return { ...state, message };
  },
};

export default provide(initialState, actions)(App);
```

```js
import { consume } from 'context-hoc';

// ...

const mapStateToProps = (state, ownProps) => {
  return {
    excitedMessage: `${state.message}!`,
  };
};

const mapActionsToProps = (actions, ownProps) => {
  return {
    greet: actions.greeting,
  };
};

export default consume(mapStateToProps, mapActionsToProps)(Child);
```
