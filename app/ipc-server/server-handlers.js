
const madge = require('madge');
const path = require('path');

// Based on https://github.com/jlongster/electron-with-server-example/blob/master/server-handlers.js
const handlers = {}

handlers._history = []

handlers['make-factorial'] = async ({ num }) => {
  handlers._history.push(num)

  function fact(n) {
    if (n === 1) {
      return 1
    }
    return n * fact(n - 1)
  }

  console.log('making factorial')
  return fact(num)
}

handlers['ring-ring'] = async () => {
  console.log('picking up the phone')
  return 'hello!'
}

handlers['get-file-dependency-tree'] = async (payload) => {
  console.log('running madge');

  // get relative path to current location
  const absPath = payload.absPath;
  const relativePath = path.relative(process.env.PWD, absPath)

  let result = await madge(relativePath)
    .then(res => {
      console.log(res)
      return res;
    })
    .then(res => res.dot())
    .catch(error => {
      console.log(error);
    })
    ;

  return result;
}

module.exports = handlers
