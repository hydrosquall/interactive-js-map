
import { SET_FILE_TREE, SET_SEARCH_RESULTS } from '../actions/file-tree';

const defaultState = {
  fileTree: undefined,
  searchResults: [], // match objects
};

// Store data relating to the dependency tree
// use selector to store filtered nodes
export default function fileTree(state = defaultState, action) {
  switch (action.type) {
    case SET_FILE_TREE:
      return { ...state, fileTree: action.payload.fileTree };
    case SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload.searchResults };
    default:
      return state;
  }
}
