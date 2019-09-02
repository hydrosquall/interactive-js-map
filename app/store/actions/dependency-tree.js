import { send } from '../../ipc-client/client-ipc';

// Help from the backend
export const SET_DOT_GRAPH = 'SET_DOT_GRAPH'; // load data in DOT string format

const DEFAULT_PATH = '/Users/cameron/Projects/open-source/d3-quadtree/src/index.js';

export function setDotGraph(dotGraph) {
  return {
    type: SET_DOT_GRAPH,
    payload: {
      dotGraph: dotGraph, // as string
    }
  };
}

export function getDotGraph(filepath = DEFAULT_PATH) {
  return async (dispatch) => {
      // TODO: send a serialized object if it's more convenient...
      const dependencyTreeAsDotString = await send('get-file-dependency-tree', { absPath: filepath });
      dispatch(setDotGraph(dependencyTreeAsDotString));
  };
}
