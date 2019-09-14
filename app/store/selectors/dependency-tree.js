import { createSelector } from 'reselect';
import { network } from 'vis-network';

import { DiGraph } from 'jsnetworkx';

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
    }
      const graph = network.convertDot(dotString);
      return {
        nodes: graph.nodes, //.map(node => ({...node })),
        // nodes: graph.nodes.map(node => ({ id: node.id })),
        edges: graph.edges
      };
  }
);

export const networkXGraph$ = createSelector( visNetworkGraph$, graph => {
  const digraph = new DiGraph();
  const networkXEdges = graph.edges.map(edge => [edge.from, edge.to]);
  digraph.addNodesFrom(graph.nodes.map(node => node.id));
  digraph.addEdgesFrom(networkXEdges);

  return digraph;
});

export default {
  dotGraph$,
  visNetworkGraph$,
  networkXGraph$
}
