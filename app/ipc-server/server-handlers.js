
const madge = require('madge');
const path = require('path');
const directoryTree = require('directory-tree');
const git = require('simple-git/promise');
const gitlog = require('gitlog');


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

handlers['get-file-dependency-tree'] = async (payload) => {
  console.log('Generating Madge Dependency Tree');

  // get relative path to current location
  const { absPath, webpackConfig } = payload;
  const relativePath = path.relative(process.env.PWD, absPath)

  const config = {
    fileExtensions: ['js', 'jsx', 'ts', 'tsx']
  };
  if (webpackConfig) {
    config.webpackConfig = webpackConfig;
  }

  const result = await madge(relativePath, config)
    .then(res =>
      // console.log(res)
       res
    )
    .then(res => res.dot())
    .catch(error => {
      console.log(error);
    })
    ;

  return result;
}

handlers['get-directory-tree'] = async (payload) => {
  console.log('getting directory structure as a tree');

  // get relative path to current location
  const { absPath } = payload;
  const relativePath = path.relative(process.env.PWD, absPath);

  return directoryTree(relativePath);
};


handlers['get-git-logs'] = async (payload) => {
  console.log('getting git log data');

  const { absPath } = payload;
  const parentFolder = path.dirname(absPath);

    // Let's find the current git repository for that particular file
    // Use the promise version instead of the callback: https://www.npmjs.com/package/simple-git
  const gitDirectory = await git(parentFolder).revparse(['--show-toplevel']);
  // console.log({gitDirectory});

  // Then, we'll get the git history for that file!
  // https://github.com/domharrington/node-gitlog#optional-fields
  const options = {
    repo: gitDirectory,
    fields: [
      'authorName',
      'committerDate',
      'subject',
      'abbrevHash'
    ],
    file: absPath,
    number: 20
  }

  let commits = gitlog(options);
  return commits;
};

module.exports = handlers
