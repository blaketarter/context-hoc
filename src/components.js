import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { shallowEquals } from './utils';

/**
 * @TODO
 * - [x] implement mapDispatchToProps
 * - [x] figure out prop omitting
 * - [ ] figure out how to handle refs
 * - [x] figure out why components show up as unkown
 * - [x] build in async action handlers (async await/promises?)
 * - [ ] test in tons of scenarios
 * - [ ] build unit tests
 * - [ ] build in a small plugin system
 * - [ ] consider changing reducer/action/action creator api
 * - [ ] look into how to name things
 * - [ ] better error handling
 * - [ ] add flow/typescript types
 * - [ ] add docs
 * - [ ] release?
 */

const StateContext = React.createContext();

export class StateProvider extends Component {
  static propTypes = {
    initialState: PropTypes.object.isRequired,
    reducer: PropTypes.func.isRequired,
    ownProps: PropTypes.any,
    // children: PropTypes.element.isRequired,
  };

  constructor({ initialState }) {
    super();
    this.state = initialState;
  }

  reduce = action =>
    this.setState((state, props) => props.reducer(state, action));

  dispatch = action => {
    if (typeof action === 'function') {
      return action(this.reduce, () => this.state);
    }
    if (typeof action === 'object' && typeof action.then === 'function') {
      return action.then(this.reduce);
    }
    return this.reduce(action);
  };

  render() {
    return (
      <StateContext.Provider
        value={{ dispatch: this.dispatch, state: this.state }}
      >
        {this.props.children(this.props.ownProps)}
      </StateContext.Provider>
    );
  }
}

export class StateConsumer extends Component {
  static propTypes = {
    mapStateToProps: PropTypes.func.isRequired,
    mapDispatchToProps: PropTypes.func.isRequired,
    ownProps: PropTypes.any,
    // children: PropTypes.element.isRequired,
  };

  render() {
    return (
      <StateContext.Consumer>
        {({ state, dispatch }) =>
          this.props.children(
            this.props.mapStateToProps(state, this.props.ownProps),
            this.props.mapDispatchToProps(dispatch, this.props.ownProps),
          )
        }
      </StateContext.Consumer>
    );
  }
}

export class ConsumeRenderHelper extends Component {
  static propTypes = {
    ownProps: PropTypes.any,
    contextProps: PropTypes.any.isRequired,
    mappedDispatches: PropTypes.any,
    // component: PropTypes.element.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    if (this.props.ownProps !== nextProps.ownProps) {
      return true;
    }
    return !shallowEquals(this.props.contextProps, nextProps.contextProps);
  }

  render() {
    return createElement(this.props.component, {
      ...this.props.ownProps,
      ...this.props.contextProps,
      ...this.props.mappedDispatches,
    });
  }
}
