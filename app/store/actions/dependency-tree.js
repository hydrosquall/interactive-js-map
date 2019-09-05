import { send } from '../../ipc-client/client-ipc';

// Help from the backend
export const SET_DOT_GRAPH = 'SET_DOT_GRAPH'; // load data in DOT string format


export function setDotGraph(dotGraph) {
  return {
    type: SET_DOT_GRAPH,
    payload: {
      dotGraph: dotGraph, // as string
    }
  };
}

export function getDotGraph(filepath, webpackConfig) {
  return async (dispatch) => {
      // TODO: send serialized object if it's more convenient instead of dotString...
      const dependencyTreeAsDotString = await send('get-file-dependency-tree', { absPath: filepath, webpackConfig });
      dispatch(setDotGraph(dependencyTreeAsDotString));
  };
}
