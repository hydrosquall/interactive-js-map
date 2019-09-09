
import { SET_FILE_TREE } from '../actions/file-tree';

const defaultState = {
  fileTree: undefined
};

// Store data relating to the dependency tree
// use selector to store filtered nodes
export default function fileTree(state = defaultState, action) {
  switch (action.type) {
    case SET_FILE_TREE:
      return {
        ...defaultState,
        fileTree: action.payload.fileTree
      };
    default:
      return state;
  }
}
