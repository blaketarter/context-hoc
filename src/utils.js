export const runMapStateToPropsIfDefined = (
  mapStateToProps,
  state,
  ownProps,
) => {
  if (typeof mapStateToProps === 'function') {
    return mapStateToProps(state, ownProps);
  }
  return {};
};

export const runMapActionsToPropsIfDefined = (
  mapActionsToProps,
  dispatch,
  ownProps,
) => {
  if (typeof mapActionsToProps === 'function') {
    return mapActionsToProps(dispatch, ownProps);
  }
  return {};
};

export const mapActionsWithDispatch = (actions, dispatch) => {
  return Object.keys(actions).reduce((mappedActions, type) => {
    const action = actions[type];
    mappedActions[type] = payload => {
      return dispatch(action(payload), { type, payload });
    };
    return mappedActions;
  }, {});
};

export const shallowEquals = (a, b) => {
  // different types means they are different
  if (typeof a !== typeof b) {
    return false;
  }

  // if its an array strict check each index
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0, ii = a.length; i < ii; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  // if its an object strict check each own prop
  if (typeof a === 'object') {
    let aKeys = 0;
    for (let property in a) {
      if (a.hasOwnProperty(property)) {
        // properties on objects dont match
        if (a[property] !== b[property]) {
          return false;
        }
        aKeys += 1;
      }
    }

    // number of keys on objects dont match
    if (aKeys !== Object.keys(b).length) {
      return false;
    }

    return true;
  }

  return a === b;
};

export const getDisplayName = component =>
  component.displayName || component.name || 'Component';

export const omitProps = (blacklist = [], props = {}) => {
  const ownProps = {};
  for (let prop in props) {
    if (props.hasOwnProperty(prop) && !blacklist.includes(prop)) {
      ownProps[prop] = props[prop];
    }
  }
  return ownProps;
};
