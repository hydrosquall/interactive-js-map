import { SET_DOT_GRAPH, SET_FILTER_PATTERNS, ADD_FILTER_PATTERNS } from '../actions/dependency-tree';

const defaultState = {
  dotGraph: 'digraph {}',
  filterPatterns: [], // list of regular expressions for excluding nodes/edges
}

// Store data relating to the dependency tree
// use selector to store filtered nodes
export default function dependencyTree(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_DOT_GRAPH:
      return { ...state, dotGraph: payload.dotGraph };
    case SET_FILTER_PATTERNS:
      return { ...state, filterPatterns: payload.filterPatterns };
    case ADD_FILTER_PATTERNS:
      return { ...state,
        filterPatterns: [
          ...state.filterPatterns,
          ...payload.filterPatterns
        ]};
    default:
      return state;
  }
}
