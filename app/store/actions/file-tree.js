import { send } from '../../ipc-client/client-ipc';

// Help from the backend
export const SET_FILE_TREE = 'SET_FILE_TREE'; // load data in DOT string format


export function setFileTree(fileTree) {
  return { type: SET_FILE_TREE, payload: { fileTree: fileTree } }; // as string
}

export function getFileTree(folderPath) {
  return async (dispatch) => {
      const fileTree = await send('get-directory-tree', { absPath: folderPath });
      // console.log(fileTree);
      dispatch(setFileTree(fileTree));
  };
}
