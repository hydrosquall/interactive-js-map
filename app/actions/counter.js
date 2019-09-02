// @flow
// Help from the backend
import { ipcRenderer } from 'electron';

import type { GetState, Dispatch } from '../reducers/types';


export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

export function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  };
}

export function incrementIfOdd() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(delay: number = 1000) {
  return async (dispatch: Dispatch) => {
      console.log("Async Bump");
      ipcRenderer.send('runMadge', { absPath: '/Users/cameron/Projects/open-source/d3-quadtree/src/index.js'});

      // Temporary: global window.send
      const result = await window.send('make-factorial', { num: 5 });

      console.log(result)
      dispatch(increment());
  };
}
