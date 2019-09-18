import { send } from '../../ipc-client/client-ipc';

// Help from the backend
export const SET_FILE_TREE = 'SET_FILE_TREE'; // load data in DOT string format
export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS'; // load data in DOT string format
export const SET_FILE_PATH = 'SET_FILE_PATH'; // load data in DOT string format


export function setFileTree(fileTree) {
  return { type: SET_FILE_TREE, payload: { fileTree } }; // as string
}

export function setSearchResults(searchResults) {
  return { type: SET_SEARCH_RESULTS, payload: { searchResults } }; // as string
}

export function setFilePath(filePath) {
  return { type: SET_FILE_PATH, payload: { filePath } }; // as string
}


export function getFileTree(folderPath) {
  return async (dispatch) => {
      const fileTree = await send('get-directory-tree', { absPath: folderPath });
      // console.log(fileTree);
      dispatch(setFileTree(fileTree));
  };
}

export function getSearchResults(searchText, folderPath) {
  return async (dispatch) => {
      const results = await send('get-ripgrep-results', {
        absPath: folderPath,
        searchText
      });
      // console.log(fileTree);
      dispatch(setSearchResults(results));
  };
}
