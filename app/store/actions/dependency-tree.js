import { send } from '../../ipc-client/client-ipc';

// Help from the backend
export const SET_DOT_GRAPH = 'SET_DOT_GRAPH'; // load data in DOT string format
export const SET_FILTER_PATTERNS = 'SET_FILTER_PATTERNS'; // load data in DOT string format
export const ADD_FILTER_PATTERNS = 'ADD_FILTER_PATTERNS'; // load data in DOT string format


export function setDotGraph(dotGraph) {
  return {
    type: SET_DOT_GRAPH,
    payload: {
      dotGraph: dotGraph, // as string
    }
  };
}

// list of strings
export function setFilterPatterns(filterPatterns) {
  return {
    type: SET_FILTER_PATTERNS,
    payload: {
      filterPatterns: filterPatterns.filter(pattern => pattern.length !== 0 ), // list of javascript regex
    }
  };
}

export function addFilterPatterns(filterPatterns) {
  return {
    type: ADD_FILTER_PATTERNS,
    payload: {
      filterPatterns: filterPatterns.filter(pattern => pattern.length !== 0 ), // list of javascript regex
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
