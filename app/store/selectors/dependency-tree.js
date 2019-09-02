import { createSelector } from 'reselect';
import { network } from 'vis-network';

import { DEPENDENCY_TREE_REDUCER_KEY } from '../constants';

// Suffix all selectors with $ instead of writing "selector"
const dependencyTreeState$ = (rootState) => rootState[DEPENDENCY_TREE_REDUCER_KEY];

// DOT format string
export const dotGraph$ = createSelector(
  dependencyTreeState$,
  dependencyTree => dependencyTree.dotGraph
);

// return object of nodes and edges suitable for vis-network package.
export const visNetworkGraph$ = createSelector(
  dotGraph$,
  dotString => {
    if (!dotString) {
      return {
        nodes: [],
        edges: []
      }
    } else {
      return network.convertDot(dotString)
    }
  }
);

export default {
  dotGraph$,
  visNetworkGraph$
}
