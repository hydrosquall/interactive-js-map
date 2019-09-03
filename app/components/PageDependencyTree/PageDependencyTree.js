import React, { useCallback, useState } from 'react';
import Graph from 'react-graph-vis';
import * as dg from 'dis-gui';


import { remote } from 'electron';

import { PrimaryAppBar } from './Toolbar';

import styles from './page-dependency-tree.css';


const { dialog } = remote; // Open file dialog

// Placeholder
const DEFAULT_PATH = '/Users/cameron/Projects/open-source/d3-quadtree/src';

const PageDependencyTree = props => {

  const [filePath, setFilePath ] = useState(DEFAULT_PATH);
  const [isHierarchical, setIsHierarchical ] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible ] = useState(false);

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

  // All the cached callbacks
  const handleFetchTree = useCallback(
    () => {
      getDotGraph(filePath);
    },
    [filePath]
  );
  const handleToggleHierarchy = useCallback(
    (event) => {
      setIsHierarchical(event);
    },
    [setIsHierarchical]
  );
  const handleSetFilepath = useCallback(
    filepath => {
      setFilePath(filepath);
    },
    [setFilePath]
  );

  const { dependencyTree, getDotGraph } = props;
  const hasNodes = dependencyTree && dependencyTree.nodes.length > 0;

  const visJsGraphOptions = { layout: { hierarchical: isHierarchical }, edges: { color: '#000000' } };

  const ControlPanel = () => <dg.GUI style={{ bottom: '0px', right: '0px', controlWidth: 400 }}>
      <dg.Folder label="Data" expanded={true}>
        <dg.Text label="Filepath" value={filePath} onChange={handleSetFilepath} />
      </dg.Folder>

      <dg.Folder label="Graph Settings" expanded={true}>
        <dg.Folder label="Layout" expanded={true}>
          <dg.Checkbox label="Use Hierarchy" checked={isHierarchical} onChange={handleToggleHierarchy} />
          <dg.Select label="Select" options={['Option one', 'Option two', 'Option three']} />
          <dg.Button label="Button" />
        </dg.Folder>
      </dg.Folder>
    </dg.GUI>;

  const appBarProps = {
    handleOpenFileClick: handleOpenFileOrDirectory,
    fetchTree: handleFetchTree
  };

  return <div>
      <PrimaryAppBar {...appBarProps}/>
      <div className={styles.graphContainer}>
        {hasNodes && (
          <Graph graph={dependencyTree} options={visJsGraphOptions} />
        )}
      </div>
      <ControlPanel></ControlPanel>
    </div>;
};

export default PageDependencyTree;
