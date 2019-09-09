// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import {
  DEPENDENCY_TREE_REDUCER_KEY,
  FILE_TREE_REDUCER_KEY
} from '../constants';

import counter from './counter';
import dependencyTree from './dependency-tree';
import fileTree from './file-tree';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter,
    [DEPENDENCY_TREE_REDUCER_KEY]: dependencyTree,
    [FILE_TREE_REDUCER_KEY]: fileTree
  });
}
