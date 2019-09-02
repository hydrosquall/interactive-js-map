
// Help from the backend
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
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(delay: number = 1000) {
  return async (dispatch) => {
      // Temporary: global window.send to the node-ipc dispatcher
      // because we can't import "send" b/c of something in webpack.
      // https://github.com/webpack/webpack/issues/4039
      const result = await window.send('get-file-dependency-tree',
                                       { absPath: '/Users/cameron/Projects/open-source/d3-quadtree/src/index.js'});

      console.log(result)
      dispatch(increment());
  };
}
