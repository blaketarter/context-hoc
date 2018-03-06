# context-hoc

[React-Redux](https://github.com/reactjs/react-redux) inspired global state library using React's new Context API and HOCs

## Example

```js
import { provide } from 'context-hoc';

// ...

const initialState = { message: '' };
const reducer = (state, action) => {
  switch (action.type) {
    case 'greeting':
      return { message: action.payload };
    default:
      return state;
  }
};

export default provide(initialState, reducer)(App);
```

```js
import { consume } from 'context-hoc';

// ...

const mapStateToProps = (state, ownProps) => {
  return {
    excitedMessage: `${state.message}!`,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => ({
  greet: payload => dispatch({ type: 'greeting', payload }),
});

export default consume(mapStateToProps, mapDispatchToProps)(Child);
```
