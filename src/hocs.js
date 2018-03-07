import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { ConsumeRenderHelper, ProvideRenderHelper } from './components';
import {
  getDisplayName,
  runMapDispatchToPropsIfDefined,
  runMapStateToPropsIfDefined,
} from './utils';

const StateContext = React.createContext();

export function provide(initialState, reducer) {
  return function wrapComponentWithProvide(componentToWrap) {
    class ProvideHOC extends React.PureComponent {
      static displayName = `ProvideHOC(${getDisplayName(componentToWrap)})`;

      state = initialState;

      reduce = action => this.setState(state => reducer(state, action));

      dispatch = action => {
        if (typeof action === 'function') {
          return action(this.dispatch, () => this.state);
        }
        if (typeof action === 'object' && typeof action.then === 'function') {
          return action.then(this.dispatch);
        }
        return this.reduce(action);
      };

      render() {
        return (
          <StateContext.Provider
            value={{ dispatch: this.dispatch, state: this.state }}
          >
            <ProvideRenderHelper
              ownProps={this.props}
              component={componentToWrap}
            />
          </StateContext.Provider>
        );
      }
    }

    return hoistStatics(ProvideHOC, componentToWrap);
  };
}

export function consume(mapStateToProps, mapDispatchToProps) {
  return function wrapComponentWithConsume(componentToWrap) {
    class ConsumeHOC extends React.PureComponent {
      static displayName = `ConsumeHOC(${getDisplayName(componentToWrap)})`;

      render() {
        return (
          <StateContext.Consumer>
            {({ state, dispatch }) => (
              <ConsumeRenderHelper
                ownProps={this.props}
                contextProps={runMapStateToPropsIfDefined(
                  mapStateToProps,
                  state,
                  this.props,
                )}
                mappedDispatches={runMapDispatchToPropsIfDefined(
                  mapDispatchToProps,
                  dispatch,
                  this.props,
                )}
                component={componentToWrap}
              />
            )}
          </StateContext.Consumer>
        );
      }
    }

    return hoistStatics(ConsumeHOC, componentToWrap);
  };
}
