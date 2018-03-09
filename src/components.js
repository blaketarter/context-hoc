import React, { createElement } from 'react';
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

export class ProvideRenderHelper extends React.PureComponent {
  static propTypes = {
    ownProps: PropTypes.any,
    component: PropTypes.any.isRequired,
  };
  render() {
    return createElement(this.props.component, this.props.ownProps);
  }
}

export class ConsumeRenderHelper extends React.Component {
  static propTypes = {
    ownProps: PropTypes.any,
    contextProps: PropTypes.any.isRequired,
    mappedActions: PropTypes.any,
    component: PropTypes.any.isRequired,
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
      ...this.props.mappedActions,
    });
  }
}
