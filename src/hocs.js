import React, { createElement } from 'react';
import {
  StateProvider,
  StateConsumer,
  ConsumeRenderHelper,
} from './components';

export const provide = (initialState, reducer) => component => {
  return function ProvideHOC(ownProps) {
    return (
      <StateProvider
        initialState={initialState}
        reducer={reducer}
        ownProps={ownProps}
      >
        {props => createElement(component, props)}
      </StateProvider>
    );
  };
};

export const consume = (mapStateToProps, mapDispatchToProps) => component => {
  return function ConsumeHOC(ownProps) {
    return (
      <StateConsumer
        mapStateToProps={mapStateToProps}
        mapDispatchToProps={mapDispatchToProps}
        ownProps={ownProps}
      >
        {(contextProps, mappedDispatches) => (
          <ConsumeRenderHelper
            component={component}
            contextProps={contextProps}
            mappedDispatches={mappedDispatches}
            ownProps={ownProps}
          />
        )}
      </StateConsumer>
    );
  };
};
