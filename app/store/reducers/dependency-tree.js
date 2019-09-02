import { SET_DOT_GRAPH } from '../actions/dependency-tree';

const defaultState = {
  dotGraph: 'digraph {}',
}

// Store data relating to the dependency tree
// use selector to store filtered nodes
export default function dependencyTree(state = defaultState, action) {
  switch (action.type) {
    case SET_DOT_GRAPH:
      return {
        ...defaultState,
        dotGraph: action.payload.dotGraph
      };

    default:
      return state;
  }
}
