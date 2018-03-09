import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { ConsumeRenderHelper, ProvideRenderHelper } from './components';
import {
  getDisplayName,
  runMapActionsToPropsIfDefined,
  runMapStateToPropsIfDefined,
  mapActionsWithDispatch,
} from './utils';

const StateContext = React.createContext();

export function provide(initialState, actions) {
  return function wrapComponentWithProvide(componentToWrap) {
    class ProvideHOC extends React.PureComponent {
      static displayName = `ProvideHOC(${getDisplayName(componentToWrap)})`;
      state = initialState;

      dispatch = (action, serializedAction) => {
        console.log('serializedAction', serializedAction); // eslint-disable-line
        const result = action(() => this.state, this.mappedActions);
        if (typeof result === 'object' && typeof result.then === 'function') {
          return result;
        }
        this.setState(result);
      }

      mappedActions = mapActionsWithDispatch(actions, this.dispatch)

      render() {
        return (
          <StateContext.Provider
            value={{ mappedActions: this.mappedActions, state: this.state }}
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

export function consume(mapStateToProps, mapActionsToProps) {
  return function wrapComponentWithConsume(componentToWrap) {
    class ConsumeHOC extends React.PureComponent {
      static displayName = `ConsumeHOC(${getDisplayName(componentToWrap)})`;

      render() {
        return (
          <StateContext.Consumer>
            {({ state, mappedActions }) => (
              <ConsumeRenderHelper
                ownProps={this.props}
                contextProps={runMapStateToPropsIfDefined(
                  mapStateToProps,
                  state,
                  this.props,
                )}
                mappedActions={runMapActionsToPropsIfDefined(
                  mapActionsToProps,
                  mappedActions,
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
