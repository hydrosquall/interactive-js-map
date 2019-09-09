import { createSelector } from 'reselect';
// import { network } from 'vis-network';
import { treeToList } from 'tree-walk-util';

import { FILE_TREE_REDUCER_KEY } from '../constants';

// Suffix all selectors with $ instead of writing "selector"
const fileTreeState$ = (rootState) => rootState[FILE_TREE_REDUCER_KEY];

// DOT format string
export const fileTree$ = createSelector(
  fileTreeState$,
  state => state.fileTree
);

export const fileTreeList$ = createSelector(
  fileTree$,
  tree => {
  if (!tree) {
    return;
  }

  const nodes = treeToList(tree);
  // console.log({nodes});
  const cytoscapeElements = nodes.flatMap(node => {

    const edges = node.children && node.children.map(child => ({ data: {source: node.path, target: child.path} })) || [];

    return [
      // node
      { data: { id: node.path, label: node.name, size: node.size, type: node.type }},
      // edges
      ...edges

    ]
  });

  return cytoscapeElements;
  }
);



export default {
  fileTree$,
  fileTreeList$,
  // visNetworkGraph$,
  // networkXGraph$
};
