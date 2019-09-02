import React, { useCallback, useState } from 'react';
import Graph from 'react-graph-vis';
import * as dg from 'dis-gui';

import { remote } from 'electron';

import styles from './page-dependency-tree.css';

const { dialog } = remote; // Open file dialog

// Placeholder
const DEFAULT_PATH = '/Users/cameron/Projects/open-source/d3-quadtree/src';
const graphOptions = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: '#000000'
  }
};

const PageDependencyTree = props => {

  const [ filePath, setFilePath ] = useState(DEFAULT_PATH);

  const handleOpenFileOrDirectory = useCallback(
    () => {
      // Note: on windows or linux, a dialog is only allowed to open one, not both
      // As a result, that would lead to just opening a directory dialogy.
      dialog
        .showOpenDialog({ properties: ['openFile', 'openDirectory'] })
        .then(payload => {
          const { canceled, filePaths, bookmarks } = payload;
          if (canceled) {
            return;
          }
          // console.log({ filePaths });
          setFilePath(filePaths[0]); // for now, stick to single-select.
        });
    },
    [setFilePath]
  );

  const handleFetchTree = useCallback(
    () => {
      getDotGraph(filePath);
    },
    [filePath]
  );

  const { dependencyTree, getDotGraph } = props;
  const hasNodes = dependencyTree && dependencyTree.nodes.length > 0;

  return (
    <div>
      <dg.GUI>
        <dg.Text label="Text" value="Hello world!" />
        <dg.Number label="Number" value={65536} />
        <dg.Number label="Range" value={512} min={-1024} max={1024} step={64} />
        <dg.Checkbox label="Checkbox" checked={true} />
        <dg.Select
          label="Select"
          options={['Option one', 'Option two', 'Option three']}
        />
        <dg.Button label="Button" />
        <dg.Folder label="Folder" expanded={true}>
          <dg.Text label="Text" value="Hello folder!" />
          <dg.Number label="Number" value={2} />
          <dg.Folder label="Subfolder" expanded={true}>
            <dg.Text label="Text" value="Hello subfolder!" />
            <dg.Number label="Number" value={2} />
          </dg.Folder>
        </dg.Folder>
      </dg.GUI>

      <div className={styles.graphContainer}>
        {hasNodes && <Graph graph={dependencyTree} options={graphOptions} />}
      </div>

      <div className={styles.btnGroup}>
        <button
          className={styles.btn}
          onClick={handleFetchTree}
          data-tclass="btn"
          type="button"
        >
          Fetch Graph
        </button>
        <button
          className={styles.btn}
          onClick={handleOpenFileOrDirectory}
          type="button"
        >
          Select File
        </button>
      </div>
    </div>
  );
};

export default PageDependencyTree;
